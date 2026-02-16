from rest_framework import serializers

from ..models import CourseRating


class CourseRatingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = CourseRating
        fields = ("id", "rating", "feedback", "student_name", "created_at")
