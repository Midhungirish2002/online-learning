from rest_framework import serializers

from ..models import Lesson, LessonProgress


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ("id", "title", "content", "lesson_order", "course", "created_at")
        read_only_fields = ("id", "course", "created_at")


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = "__all__"
        read_only_fields = ("completed_at", "is_active")
