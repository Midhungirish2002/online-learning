from django.db import models as django_models
from rest_framework import serializers

from ..models import User, Enrollment, QuizAttempt, Course, Lesson, LessonProgress, CourseRating


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


class AdminUserDetailSerializer(UserSerializer):
    """
    Serializer for Admins to view full user details (Progress, Enrollments).
    """
    enrollments = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    created_courses = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('enrollments', 'stats', 'created_courses')
        read_only_fields = fields

    def get_stats(self, obj):
        stats = {
            "total_courses": Enrollment.objects.filter(student=obj).count(),
            "quizzes_passed": QuizAttempt.objects.filter(student=obj, is_passed=True).count(),
            "avg_quiz_score": QuizAttempt.objects.filter(student=obj).aggregate(avg=django_models.Avg('score'))['avg'] or 0
        }

        # Instructor Specific Stats
        if getattr(obj.role, "name", "") == "INSTRUCTOR":
            instructor_courses = Course.objects.filter(instructor=obj)
            stats["instructor_courses_count"] = instructor_courses.count()
            stats["instructor_total_students"] = Enrollment.objects.filter(course__in=instructor_courses).count()
            stats["instructor_avg_rating"] = CourseRating.objects.filter(course__in=instructor_courses).aggregate(avg=django_models.Avg('rating'))['avg'] or 0

        return stats

    def get_created_courses(self, obj):
        if getattr(obj.role, "name", "") != "INSTRUCTOR":
            return None
        
        courses = Course.objects.filter(instructor=obj).order_by('-created_at')
        data = []
        for c in courses:
            students = Enrollment.objects.filter(course=c).count()
            avg_rating = CourseRating.objects.filter(course=c).aggregate(avg=django_models.Avg('rating'))['avg'] or 0
            
            data.append({
                "id": c.id,
                "title": c.title,
                "is_published": c.is_published,
                "is_active": c.is_active,
                "created_at": c.created_at,
                "total_students": students,
                "average_rating": round(avg_rating, 1)
            })
        return data

    def get_enrollments(self, obj):
        data = []
        enrollments = Enrollment.objects.filter(student=obj).select_related('course')
        
        for env in enrollments:
            total_lessons = Lesson.objects.filter(course=env.course).count()
            completed = LessonProgress.objects.filter(enrollment=env, completed_at__isnull=False).count()
            
            progress = (completed / total_lessons * 100) if total_lessons > 0 else 0
            
            # Get last quiz attempt for this course
            last_attempt = QuizAttempt.objects.filter(quiz__course=env.course, student=obj).order_by('-attempted_at').first()
            quiz_status = "Not Attempted"
            if last_attempt:
                quiz_status = f"{last_attempt.score}% ({'Passed' if last_attempt.is_passed else 'Failed'})"

            data.append({
                "id": env.id,
                "course_title": env.course.title,
                "enrolled_at": env.enrolled_at,
                "is_active": env.is_active,
                "progress_percent": round(progress, 2),
                "completed_lessons": completed,
                "total_lessons": total_lessons,
                "quiz_status": quiz_status
            })
        return data
