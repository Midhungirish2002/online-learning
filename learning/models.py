from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager

from .managers import ActiveManager, AllObjectsManager

# ---- Role / Permission ----
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)  # values: ADMIN, INSTRUCTOR, STUDENT
    is_active = models.BooleanField(default=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def __str__(self):
        return self.name

class Permission(models.Model):
    code = models.CharField(max_length=128, unique=True)
    is_active = models.BooleanField(default=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def __str__(self):
        return self.code
#usermanager
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)
#user
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    profile_image = models.ImageField(
        upload_to="profiles/",
        null=True,
        blank=True
    )

    role = models.ForeignKey(Role, on_delete=models.PROTECT)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]



class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    permission = models.ForeignKey(Permission, on_delete=models.PROTECT)

    class Meta:
        unique_together = ("role", "permission")


# ---- Core learning models following ER diagram ----
class Course(models.Model):
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    lesson_order = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    enrolled_at = models.DateTimeField(default=timezone.now)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.PROTECT)
    lesson = models.ForeignKey(Lesson, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    total_marks = models.IntegerField(default=0)
    pass_marks = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_text = models.TextField()
    option_a = models.TextField()
    option_b = models.TextField()
    option_c = models.TextField(null=True, blank=True)
    option_d = models.TextField(null=True, blank=True)
    correct_option = models.CharField(max_length=3)
    is_active = models.BooleanField(default=True)

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    def soft_delete(self):
        self.is_active = False
        self.save()

class QuizAttempt(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    quiz = models.ForeignKey(Quiz, on_delete=models.PROTECT)
    score = models.FloatField(null=True, blank=True)
    is_passed = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(default=timezone.now)

    objects = models.Manager()        # ✅ DEFAULT MANAGER
# learning/models.py

class CourseRating(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="ratings"
    )
    rating = models.IntegerField()  # 1–5
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")


class Notification(models.Model):
    """Real-time notification model for user alerts."""
    NOTIFICATION_TYPES = [
        ('QUIZ_GRADED', 'Quiz Graded'),
        ('ENROLLED', 'Course Enrollment'),
        ('NEW_COURSE', 'New Course Available'),
        ('LESSON_COMPLETE', 'Lesson Completed'),
        ('COURSE_COMPLETE', 'Course Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.user.username}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='comments')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    text = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.user.username} on {self.course.title}"


class Wishlist(models.Model):
    """Student bookmarks courses to enroll later."""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlisted_courses'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class LectureNote(models.Model):
    """Private notes students take during lessons."""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lecture_notes'
    )
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'lesson']),
        ]

    def __str__(self):
        return f"Note by {self.student.username} for {self.lesson.title}"
