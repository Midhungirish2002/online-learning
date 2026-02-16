from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..models import Course, Lesson, Enrollment, LessonProgress
from ..serializers import LessonSerializer
from ..permissions import IsInstructor, IsStudent


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


class LessonDetailView(generics.RetrieveAPIView):
    """
    Get lesson content.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


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

        # Enforce lesson order ONLY
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

        # Mark lesson completed
        progress, _ = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson
        )
        progress.completed_at = timezone.now()
        progress.save()

        # Send notification
        from ..notifications import send_notification
        send_notification(
            user_id=user.id,
            notification_type='LESSON_COMPLETE',
            message=f'You completed "{lesson.title}"!',
            data={'lesson_id': lesson.id, 'course_id': lesson.course.id}
        )

        return Response(
            {"message": "Lesson completed"},
            status=status.HTTP_200_OK
        )
