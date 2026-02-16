"""
Modular serializers package for the learning application.

This package organizes serializers by functional domain for better maintainability.
All serializers are exported from this __init__.py for backward compatibility.
"""

from .auth import CustomTokenObtainPairSerializer, RegisterUserSerializer
from .users import UserSerializer, AdminUserDetailSerializer
from .courses import CourseSerializer
from .lessons import LessonSerializer, LessonProgressSerializer
from .quizzes import QuizSerializer, QuestionSerializer, QuizAttemptSerializer
from .enrollments import EnrollmentSerializer
from .ratings import CourseRatingSerializer
from .interactions import WishlistSerializer, LectureNoteSerializer

__all__ = [
    # Authentication
    'CustomTokenObtainPairSerializer',
    'RegisterUserSerializer',
    
    # User Management
    'UserSerializer',
    'AdminUserDetailSerializer',
    
    # Courses
    'CourseSerializer',
    
    # Lessons
    'LessonSerializer',
    'LessonProgressSerializer',
    
    # Quizzes
    'QuizSerializer',
    'QuestionSerializer',
    'QuizAttemptSerializer',
    
    # Enrollments
    'EnrollmentSerializer',
    
    # Ratings
    'CourseRatingSerializer',
    
    # Interactions
    'WishlistSerializer',
    'LectureNoteSerializer',
]
