from typing import List, Dict, Any
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer

from ..models import Course, Lesson, Enrollment, LessonProgress, Quiz, Question, QuizAttempt
from ..serializers import QuizSerializer, QuestionSerializer, QuizAttemptSerializer
from ..permissions import IsInstructor, IsStudent


class QuizListCreateView(generics.ListCreateAPIView):
    """
    GET: List quizzes for a course.
    POST: Create a quiz for a course.
    """
    serializer_class = QuizSerializer

    def get_permissions(self) -> List[BasePermission]:
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsInstructor()]
        return [IsAuthenticated()]

    def get_queryset(self) -> QuerySet[Quiz]:
        course_id = self.kwargs.get('course_id')
        return Quiz.objects.filter(course_id=course_id)

    def perform_create(self, serializer: BaseSerializer) -> None:
        course_id = self.kwargs.get('course_id')
        course = get_object_or_404(Course, pk=course_id, instructor=self.request.user)
        serializer.save(course=course)


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Question]:
        quiz_id = self.kwargs.get('quiz_id')
        return Question.objects.filter(quiz_id=quiz_id)

    def perform_create(self, serializer: BaseSerializer) -> None:
        # Additional check: only instructor of the course can add questions
        quiz_id = self.kwargs.get("quiz_id")
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Ensure user is the instructor of the course
        if quiz.course.instructor != self.request.user:
             raise permissions.PermissionDenied("You can only add questions to your own quizzes.")

        serializer.save(
            quiz=quiz,
            correct_option=serializer.validated_data["correct_option"].strip().upper()
        )


class AttemptQuizView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request: Request, quiz_id: int) -> Response:
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

        if not LessonProgress.objects.filter(
            enrollment=enrollment,
            lesson=final_lesson,
            completed_at__isnull=False
        ).exists():
            return Response(
                {"error": "Complete the final lesson before attempting the quiz."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 3. Block if already passed
        if QuizAttempt.objects.filter(
            student=user,
            quiz=quiz,
            is_passed=True
        ).exists():
            return Response(
                {"error": "Quiz already passed."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 4. Validate answers
        answers: Dict[str, str] = request.data.get("answers")
        if not isinstance(answers, dict):
            return Response(
                {"error": "Answers must be a dictionary {question_id: option}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Normalize keys
        answers = {str(k): v for k, v in answers.items()}

        questions = Question.objects.filter(quiz=quiz)
        if not questions.exists():
            return Response(
                {"error": "Quiz has no questions."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 5. Grade quiz (CORRECT)
        correct = 0
        index_to_letter = {
            "0": "A", "1": "B", "2": "C", "3": "D",
            0: "A", 1: "B", 2: "C", 3: "D",
        }

        for q in questions:
            raw_ans = answers.get(str(q.id))
            if raw_ans is None:
                continue

            user_ans = str(raw_ans).strip().upper()
            user_ans = index_to_letter.get(user_ans, user_ans)

            correct_opt = q.correct_option.strip().upper()

            if user_ans == correct_opt:
                correct += 1

        # 6. Calculate score
        percentage = (correct / questions.count()) * 100
        is_passed = percentage >= 50   # or quiz.pass_percentage
        score = percentage

        # 7. Save attempt
        attempt = QuizAttempt.objects.create(
            student=user,
            quiz=quiz,
            score=score,
            is_passed=is_passed
        )

        # 8. Send real-time notification
        from ..notifications import send_notification
        send_notification(
            user_id=user.id,
            notification_type='QUIZ_GRADED',
            message=f"Quiz graded: {score:.0f}% - {'Passed! 🎉' if is_passed else 'Try again'}",
            data={
                'quiz_id': quiz.id,
                'course_id': quiz.course.id,
                'course_title': quiz.course.title,
                'score': score,
                'is_passed': is_passed
            }
        )

        # 9. Email if passed
        if is_passed:
            send_mail(
                subject="🎉 Course Completed Successfully!",
                message=(
                    f"Hi {user.username},\n\n"
                    f"You passed the quiz for '{quiz.course.title}'.\n\n"
                    f"Score: {score}/{quiz.total_marks}\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

        return Response(
            {
                "message": "Quiz passed" if is_passed else "Quiz failed",
                "score": score,
                "correct_answers": correct,
                "total_questions": questions.count(),
                "data": QuizAttemptSerializer(attempt).data,
            },
            status=status.HTTP_201_CREATED
        )


class QuizResultsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request, quiz_id: int) -> Response:
        attempts = QuizAttempt.objects.filter(
            student=request.user,
            quiz_id=quiz_id
        ).order_by("-attempted_at")

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
