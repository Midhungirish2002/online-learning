from rest_framework import serializers

from ..models import Quiz, Question, QuizAttempt


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
        read_only_fields = ("created_at", "updated_at", "is_active", "course")


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
