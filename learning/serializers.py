from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Course,
    Lesson,
    Enrollment,
    QuizAttempt,
    Quiz,
    Question,
    Role,
    LessonProgress,
    CourseRating 
)

User = get_user_model()

# =======================
# USER
# =======================

class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role_name",
            "created_at",
            "profile_image",
        )
        read_only_fields = ("id", "created_at")


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        role_name = validated_data.pop("role")

        if role_name not in ["ADMIN", "INSTRUCTOR", "STUDENT"]:
            raise serializers.ValidationError(
                {"role": "Invalid role. Must be ADMIN, INSTRUCTOR, or STUDENT."}
            )

        try:
            role_obj = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Role does not exist."})

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=role_obj
        )
        return user


# =======================
# COURSE / LESSON
# =======================

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ("instructor", "created_at", "updated_at", "is_active")


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ("id", "title", "content", "lesson_order", "course", "created_at")
        read_only_fields = ("id", "course", "created_at")


# =======================
# ENROLLMENT
# =======================

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = (
            "id",
            "course",
            "course_title",
            "enrolled_at",
            "is_active",
        )
        read_only_fields = fields


# =======================
# QUIZ
# =======================

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = (
            "id",
            "question_text",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_option",
            "quiz",
        )
        read_only_fields = ("quiz",)

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(
        many=True, read_only=True, source="question_set"
    )

    class Meta:
        model = Quiz
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "is_active")


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.course.title", read_only=True)

    class Meta:
        model = QuizAttempt
        fields = (
            "id",
            "quiz",
            "quiz_title",
            "score",
            "is_passed",
            
            "attempted_at",
        )
        read_only_fields = fields


# =======================
# LESSON PROGRESS
# =======================

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = "__all__"
        read_only_fields = ("completed_at", "is_active")
# learning/serializers.py

class CourseRatingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = CourseRating
        fields = ("id", "rating", "feedback", "student_name", "created_at")
