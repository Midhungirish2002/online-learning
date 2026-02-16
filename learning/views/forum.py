from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import Comment, Course, Enrollment
from ..serializers.forum import CommentSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    """
    GET: List comments for a course (optionally filtered by lesson).
    POST: Create a new comment.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        lesson_id = self.request.query_params.get('lesson_id')
        
        queryset = Comment.objects.filter(course_id=course_id, parent__isnull=True).order_by('-created_at')
        
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        else:
            queryset = queryset.filter(lesson__isnull=True)
            
        return queryset

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        user = self.request.user
        
        # Verify enrollment or instructor status
        course = get_object_or_404(Course, pk=course_id)
        is_instructor = course.instructor == user
        is_enrolled = Enrollment.objects.filter(student=user, course=course, is_active=True).exists()
        
        if not (is_instructor or is_enrolled or user.role.name == 'ADMIN'):
             raise PermissionDenied("You must be enrolled to post comments.")

        serializer.save(user=user, course=course)


class CommentDeleteView(generics.DestroyAPIView):
    """
    Delete a comment. Only owner or instructor can delete.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.user != user and instance.course.instructor != user and user.role.name != 'ADMIN':
            raise PermissionDenied("You can only delete your own comments.")
        instance.delete()
