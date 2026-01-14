from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
import csv
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse

from .models import (
    Course, Lesson, Enrollment, LessonProgress, 
    Quiz, Question, QuizAttempt,
    CourseRating
)
from .serializers import (
    UserSerializer,
    RegisterUserSerializer,
    CourseSerializer,
    LessonSerializer,
    EnrollmentSerializer,
    LessonProgressSerializer,
    QuizSerializer,
    QuestionSerializer,
    QuizAttemptSerializer,
    CourseRatingSerializer
)
from .permissions import IsInstructor, IsStudent, IsAdmin

User = get_user_model()

# ---- AUTHENTICATION ----

class RegisterView(generics.CreateAPIView):
    """
    Register a new user (Student/Instructor).
    """
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """
    Login using SimpleJWT.
    """
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        user = self.request.user

        # ✅ ADMIN OVERRIDE
        user_id = self.request.query_params.get("user_id")

        if user.is_staff or getattr(user.role, "name", "") == "ADMIN":
            if user_id:
                return get_object_or_404(User, id=user_id)

        # 👇 Default: return self
        return user


# ---- COURSE MANAGEMENT ----

class CreateCourseView(generics.CreateAPIView):
    """
    Instructor creates a course.
    """
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
class PublishUnpublishCourseView(APIView):
    """
    Instructor publishes or unpublishes a course.
    """
    permission_classes = [IsAuthenticated, IsInstructor]

    def patch(self, request, course_id):
        course = get_object_or_404(
            Course,
            pk=course_id,
            instructor=request.user
        )

        is_published = request.data.get("is_published")

        if is_published is None:
            return Response(
                {"error": "is_published field is required (true/false)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        course.is_published = is_published
        course.save()

        return Response(
            {
                "course_id": course.id,
                "is_published": course.is_published,
                "message": "Course published" if is_published else "Course unpublished"
            },
            status=status.HTTP_200_OK
        )


class EnrollCourseView(APIView):
    """
    Student enrolls in a course.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id, is_published=True) # Students can only enroll if published
        user = request.user
        
        if Enrollment.objects.filter(student=user, course=course).exists():
            return Response({'error': 'Already enrolled'}, status=status.HTTP_400_BAD_REQUEST)

        enrollment = Enrollment.objects.create(student=user, course=course)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)


class MyCoursesView(generics.ListAPIView):
    """
    List courses authenticated student is enrolled in.
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)


# ---- LESSON MANAGEMENT ----

class LessonListCreateView(generics.ListCreateAPIView):
    """
    GET: List lessons with status (Student).
    POST: Add lesson (Instructor).
    """
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsInstructor()]
        return [IsAuthenticated()]

    def list(self, request, course_id):
        lessons = Lesson.objects.filter(course_id=course_id).order_by('lesson_order')
        
        # Get progress if enrolled
        user = request.user
        progress_ids = set()
        
        # Optimize: get enrollment and progress in minimal queries
        enrollment = Enrollment.objects.filter(student=user, course_id=course_id).first()
        if enrollment:
             progress_ids = set(
                 LessonProgress.objects.filter(
                     enrollment=enrollment, 
                     completed_at__isnull=False
                 ).values_list('lesson_id', flat=True)
             )

        data = []
        prev_completed = True
        total_lessons = len(lessons)

        for i, lesson in enumerate(lessons):
            is_completed = lesson.id in progress_ids
            is_locked = not prev_completed
            is_final = (i == total_lessons - 1)
            
            data.append({
                "id": lesson.id,
                "title": lesson.title,
                "lesson_order": lesson.lesson_order,
                "is_completed": is_completed,
                "is_locked": is_locked,
                "is_final": is_final
            })
            
            if not is_completed:
                prev_completed = False

        return Response(data)

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        course = get_object_or_404(Course, pk=course_id, instructor=self.request.user)
        serializer.save(course=course)

class CompleteLessonView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, lesson_id):
        user = request.user
        lesson = get_object_or_404(Lesson, pk=lesson_id)

        enrollment = get_object_or_404(
            Enrollment,
            student=user,
            course=lesson.course
        )

        # 1️⃣ Enforce lesson order
        prev_lesson = Lesson.objects.filter(
            course=lesson.course,
            lesson_order=lesson.lesson_order - 1
        ).first()

        if prev_lesson:
            completed = LessonProgress.objects.filter(
                enrollment=enrollment,
                lesson=prev_lesson,
                completed_at__isnull=False
            ).exists()

            if not completed:
                return Response(
                    {"error": "Complete previous lesson first."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # 2️⃣ QUIZ GATE ONLY IF previous lesson is FINAL
        final_lesson_order = (
            Lesson.objects
            .filter(course=lesson.course)
            .order_by("-lesson_order")
            .values_list("lesson_order", flat=True)
            .first()
        )

        if prev_lesson and prev_lesson.lesson_order == final_lesson_order:
            quiz = Quiz.objects.filter(course=lesson.course).first()
            if quiz:
                quiz_passed = QuizAttempt.objects.filter(
                    student=user,
                    quiz=quiz,
                    is_passed=True
                ).exists()

                if not quiz_passed:
                    return Response(
                        {"error": "You must pass the quiz to unlock the next lesson."},
                        status=status.HTTP_403_FORBIDDEN
                    )

        # 3️⃣ Mark lesson completed
        progress, _ = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson
        )
        progress.completed_at = timezone.now()
        progress.save()

        return Response(
            {"message": "Lesson completed"},
            status=status.HTTP_200_OK
        )

# ---- QUIZ MANAGEMENT ----

class CreateQuizView(generics.CreateAPIView):
    """
    Instructor creates a quiz.
    """
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_create(self, serializer):
        # Expecting course to be passed in data
        course = serializer.validated_data['course']
        if course.instructor != self.request.user:
            raise permissions.PermissionDenied("You can only add quizzes to your own courses.")
        serializer.save()




class CreateQuestionView(generics.CreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_create(self, serializer):
        quiz_id = self.kwargs.get("quiz_id")
        quiz = get_object_or_404(
            Quiz,
            pk=quiz_id,
            course__instructor=self.request.user
        )

        serializer.save(
            quiz=quiz,
            correct_option=serializer.validated_data["correct_option"]
            .strip()
            .upper()   # ✅ CRITICAL FIX
        )
class AttemptQuizView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, quiz_id):
        user = request.user
        quiz = get_object_or_404(Quiz, pk=quiz_id)

        # 1. Ensure student is enrolled
        enrollment = get_object_or_404(
            Enrollment,
            student=user,
            course=quiz.course
        )

        # 2. Ensure FINAL lesson is completed
        final_lesson = (
            Lesson.objects
            .filter(course=quiz.course)
            .order_by("-lesson_order")
            .first()
        )

        if not final_lesson:
            return Response(
                {"error": "No lessons found for this course."},
                status=status.HTTP_400_BAD_REQUEST
            )

        final_completed = LessonProgress.objects.filter(
            enrollment=enrollment,
            lesson=final_lesson,
            completed_at__isnull=False
        ).exists()

        if not final_completed:
            return Response(
                {"error": "Complete the final lesson before attempting the quiz."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 3. Block if quiz already PASSED
        if QuizAttempt.objects.filter(
            student=user,
            quiz=quiz,
            is_passed=True
        ).exists():
            return Response(
                {"error": "Quiz already passed. Course completed."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 4. Validate answers
        answers = request.data.get("answers")
        if not isinstance(answers, dict):
            return Response(
                {"error": "Answers must be a dictionary {question_id: option}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        questions = Question.objects.filter(quiz=quiz)
        if not questions.exists():
            return Response(
                {"error": "Quiz has no questions."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 5. Grade quiz
        correct = 0
        for q in questions:
            if answers.get(str(q.id)) == q.correct_option:
                correct += 1

        marks_per_question = quiz.total_marks / questions.count()
        score = correct * marks_per_question
        is_passed = score >= quiz.pass_marks

        # 6. Save attempt
        attempt = QuizAttempt.objects.create(
            student=user,
            quiz=quiz,
            score=score,
            is_passed=is_passed,
        )

        # 6. Send email ONLY if passed
        if is_passed:
            send_mail(
                subject="🎉 Course Completed Successfully!",
                message=(
                    f"Hi {user.username},\n\n"
                    f"Congratulations! 🎉\n\n"
                    f"You have successfully passed the quiz for the course "
                    f"'{quiz.course.title}'.\n\n"
                    f"Score: {score}/{quiz.total_marks}\n\n"
                    f"Keep learning!\n"
                    f"- Online Learning Platform"
                ),
                from_email=None,  # uses DEFAULT_FROM_EMAIL
                recipient_list=[user.email],
                fail_silently=False,
            )

        return Response(
            {
                "message": "Quiz passed" if is_passed else "Quiz failed",
                "data": QuizAttemptSerializer(attempt).data
            },
            status=status.HTTP_201_CREATED
        )



class QuizResultsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, quiz_id):
        attempts = QuizAttempt.objects.filter(
            student=request.user,
            quiz_id=quiz_id
        ).order_by("-attempted_at")

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ---- ADMIN ----

class AdminDashboardView(APIView):
    """
    Admin checks system stats.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        stats = {
            "users_count": User.objects.count(),
            "courses_count": Course.objects.count(),
            "enrollments_count": Enrollment.objects.count(),
            "quizzes_count": Quiz.objects.count(),
        }
        return Response(stats)


class ExportStudentResultsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_content_negotiation(self, request, force=False):
        # Bypass DRF content negotiation to prevent 404 on ?format=excel
        return (self.get_renderers()[0], '*/*')

    def get(self, request):
        export_format = request.query_params.get("format", "").lower()

        if export_format == "excel":
            return self.export_excel()

        if export_format == "pdf":
            return self.export_pdf()

        return Response(
            {"error": "Invalid or missing format. Use ?format=excel or ?format=pdf"},
            status=400
        )

    def get_queryset(self):
        return QuizAttempt.objects.select_related(
            "student", "quiz", "quiz__course"
        )

    def export_excel(self):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="quiz_results.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "Student",
            "Course",
            "Quiz ID",
            "Score",
            "Passed",
            "Attempted At"
        ])

        for a in self.get_queryset():
            writer.writerow([
                a.student.username,
                a.quiz.course.title,
                a.quiz.id,
                a.score,
                "YES" if a.is_passed else "NO",
                a.attempted_at.strftime("%Y-%m-%d %H:%M")
            ])

        return response

    def export_pdf(self):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="quiz_results.pdf"'

        doc = SimpleDocTemplate(response, pagesize=A4)
        elements = []

        # Title
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Student Quiz Results Report", styles["Title"]))

        # Table Data
        data = [["Student", "Course", "Score", "Status", "Date"]]
        
        for a in self.get_queryset():
            data.append([
                a.student.username,
                a.quiz.course.title,
                str(a.score),
                "PASSED" if a.is_passed else "FAILED",
                a.attempted_at.strftime("%Y-%m-%d")
            ])

        # Table Formatting
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))

        elements.append(table)
        doc.build(elements)
        return response
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg

User = get_user_model()

class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users_by_role = (
            User.objects
            .values("role__name")
            .annotate(count=Count("id"))
        )

        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(is_published=True).count()
        total_enrollments = Enrollment.objects.count()

        total_attempts = QuizAttempt.objects.count()
        passed_attempts = QuizAttempt.objects.filter(is_passed=True).count()

        pass_rate = (
            round((passed_attempts / total_attempts) * 100, 2)
            if total_attempts > 0 else 0
        )

        return Response({
            "users_by_role": {
                item["role__name"]: item["count"]
                for item in users_by_role
            },
            "courses": {
                "total": total_courses,
                "published": published_courses,
            },
            "enrollments": total_enrollments,
            "quiz_pass_rate_percent": pass_rate,
        })
        
class InstructorAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        instructor = request.user
        courses = Course.objects.filter(instructor=instructor)

        course_data = []

        for course in courses:
            enrollments = Enrollment.objects.filter(course=course).count()

            attempts = QuizAttempt.objects.filter(
                quiz__course=course
            )

            completed = attempts.filter(is_passed=True).count()
            avg_score = attempts.aggregate(avg=Avg("score"))["avg"] or 0

            completion_rate = (
                round((completed / enrollments) * 100, 2)
                if enrollments > 0 else 0
            )

            course_data.append({
                "course_id": course.id,
                "course_title": course.title,
                "enrolled_students": enrollments,
                "completed_students": completed,
                "completion_rate_percent": completion_rate,
                "average_score": round(avg_score, 2),
            })

        return Response({
            "instructor": instructor.username,
            "courses": course_data
        })
class CourseRatingCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)

        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course,
            is_active=True
        ).exists()

        if not enrolled:
            return Response(
                {"error": "You must be enrolled to rate this course"},
                status=403
            )

        serializer = CourseRatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        CourseRating.objects.create(
            student=request.user,
            course=course,
            rating=serializer.validated_data["rating"],
            feedback=serializer.validated_data.get("feedback", "")
        )

        return Response(
            {"message": "Course rated successfully"},
            status=201
        )


class CourseRatingsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)

        ratings = CourseRating.objects.filter(
            course=course
        ).order_by("-created_at")

        avg_rating = ratings.aggregate(
            Avg("rating")
        )["rating__avg"] or 0

        serializer = CourseRatingSerializer(ratings, many=True)

        return Response({
            "course_id": course.id,
            "course_title": course.title,
            "average_rating": round(avg_rating, 2),
            "total_ratings": ratings.count(),
            "ratings": serializer.data
        }, status=200)


# ---- SOFT DELETE (ADMIN) ----

class AdminUserDeactivateView(APIView):
    """
    Admin deactivates a user (Soft Delete).
    Prevent login.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.is_active = False
        user.save()
        return Response({"message": "User deactivated successfully"}, status=status.HTTP_200_OK)


class AdminReactivateUserView(APIView):
    """
    Admin reactivates a user.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        if user.is_active:
            return Response(
                {"error": "User is already active"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.is_active = True
        user.save()
        return Response({"message": "User activated successfully"}, status=status.HTTP_200_OK)


class AdminCourseDeactivateView(APIView):
    """
    Admin deactivates a course (Soft Delete).
    Hides from students/instructors.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, course_id):
        # We can deactivate an already active course
        course = get_object_or_404(Course, id=course_id)
        course.is_active = False
        course.save()
        return Response({"message": "Course deactivated successfully"}, status=status.HTTP_200_OK)


class CourseToggleStatusView(APIView):
    """
    Toggle course status (Active/Inactive).
    - Admins: Can toggle ANY course.
    - Instructors: Can toggle ONLY their own courses.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, course_id):
        # Use all_objects to find even inactive courses
        course = get_object_or_404(Course.all_objects, id=course_id)
        user = request.user

        # Permission Check
        is_admin = getattr(user.role, "name", "") == "ADMIN" or user.is_staff
        is_instructor = getattr(user.role, "name", "") == "INSTRUCTOR"
        is_owner = course.instructor == user

        if not (is_admin or (is_instructor and is_owner)):
             return Response(
                {"error": "You do not have permission to modify this course."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Toggle Logic
        previous_status = "Active" if course.is_active else "Inactive"
        course.is_active = not course.is_active
        course.save()
        
        new_status = "Active" if course.is_active else "Inactive"
        action = "activated" if course.is_active else "deactivated"

        return Response({
            "course_id": course.id,
            "previous_status": previous_status,
            "new_status": new_status,
            "action_performed": action,
            "message": f"Course successfully {action}"
        }, status=status.HTTP_200_OK)


class AdminToggleUserStatusView(APIView):
    """
    Toggle user status (Active/Inactive).
    - Admins only.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        # Toggle Logic
        previous_status = "Active" if user.is_active else "Inactive"
        user.is_active = not user.is_active
        user.save()
        
        new_status = "Active" if user.is_active else "Inactive"
        action = "activated" if user.is_active else "deactivated"

        return Response({
            "user_id": user.id,
            "previous_status": previous_status,
            "new_status": new_status,
            "action_performed": action,
            "message": f"User successfully {action}"
        }, status=status.HTTP_200_OK)
