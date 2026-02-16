from rest_framework import serializers

from ..models import Course


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ("instructor", "created_at", "updated_at", "is_active")
