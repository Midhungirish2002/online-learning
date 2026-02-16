from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import Wishlist, LectureNote, Course, Lesson
from ..serializers import WishlistSerializer, LectureNoteSerializer
from ..permissions import IsStudent


class WishlistListCreateView(APIView):
    """
    GET: List all wishlisted courses for the student.
    POST: Add a course to wishlist.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        wishlists = Wishlist.objects.filter(student=request.user)
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        course_id = request.data.get('course_id')
        
        if not course_id:
            return Response(
                {"error": "course_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        course = get_object_or_404(Course, id=course_id, is_published=True)
        
        # Check if already in wishlist
        if Wishlist.objects.filter(student=request.user, course=course).exists():
            return Response(
                {"error": "Course already in wishlist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wishlist = Wishlist.objects.create(student=request.user, course=course)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WishlistDeleteView(APIView):
    """
    DELETE: Remove a course from wishlist.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def delete(self, request, wishlist_id):
        wishlist = get_object_or_404(Wishlist, id=wishlist_id, student=request.user)
        wishlist.delete()
        return Response(
            {"message": "Removed from wishlist"},
            status=status.HTTP_200_OK
        )


class LectureNoteListCreateView(APIView):
    """
    GET: List all notes for a specific lesson (query param: lesson_id).
    POST: Create a new note.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        lesson_id = request.query_params.get('lesson_id')
        
        if not lesson_id:
            return Response(
                {"error": "lesson_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        notes = LectureNote.objects.filter(student=request.user, lesson_id=lesson_id)
        serializer = LectureNoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        content = request.data.get('content', '').strip()
        
        if not lesson_id or not content:
            return Response(
                {"error": "lesson_id and content are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        note = LectureNote.objects.create(
            student=request.user,
            lesson=lesson,
            content=content
        )
        
        serializer = LectureNoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LectureNoteUpdateDeleteView(APIView):
    """
    PATCH: Update note content.
    DELETE: Delete a note.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def patch(self, request, note_id):
        note = get_object_or_404(LectureNote, id=note_id, student=request.user)
        content = request.data.get('content', '').strip()
        
        if not content:
            return Response(
                {"error": "content is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        note.content = content
        note.save()
        
        serializer = LectureNoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, note_id):
        note = get_object_or_404(LectureNote, id=note_id, student=request.user)
        note.delete()
        return Response(
            {"message": "Note deleted successfully"},
            status=status.HTTP_200_OK
        )
