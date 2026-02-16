from django.db.models import Avg
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..models import Course, Enrollment, Lesson, LessonProgress, QuizAttempt
from ..permissions import IsInstructor


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


class InstructorStudentListView(APIView):
    """
    List all students enrolled in the instructor's courses with progress.
    """
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        # 1. Get all enrollments for courses taught by this instructor
        enrollments = Enrollment.objects.filter(
            course__instructor=request.user
        ).select_related('student', 'course')

        data = []

        for enrollment in enrollments:
            course = enrollment.course
            student = enrollment.student

            # 2. Calculate Progress
            total_lessons = Lesson.objects.filter(course=course).count()
            completed_lessons = LessonProgress.objects.filter(
                enrollment=enrollment,
                completed_at__isnull=False
            ).count()

            progress_percentage = 0
            if total_lessons > 0:
                progress_percentage = round((completed_lessons / total_lessons) * 100, 2)

            data.append({
                "student_id": student.id,
                "student_name": student.username,
                "student_email": student.email,
                "course_title": course.title,
                "enrolled_at": enrollment.enrolled_at,
                "progress_percentage": progress_percentage,
                "completed_lessons": completed_lessons,
                "total_lessons": total_lessons,
            })

        return Response(data, status=status.HTTP_200_OK)
