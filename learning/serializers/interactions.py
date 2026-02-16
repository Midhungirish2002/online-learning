from rest_framework import serializers
from ..models import Wishlist, LectureNote, Course, Lesson


class WishlistSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_description = serializers.CharField(source='course.description', read_only=True)
    instructor_name = serializers.CharField(source='course.instructor.username', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'course', 'course_title', 'course_description', 'instructor_name', 'added_at']
        read_only_fields = ['id', 'added_at']


class LectureNoteSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = LectureNote
        fields = ['id', 'lesson', 'lesson_title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
