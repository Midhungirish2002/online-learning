"""
Modular views package for the learning application.

This package organizes views by functional domain for better maintainability.
All views are exported from this __init__.py for backward compatibility.
"""

from .auth import RegisterView, LoginView
from .users import UserProfileView
from .courses import (
    CreateCourseView,
    DeleteCourseView,
    CourseDetailView,
    PublishUnpublishCourseView,
    EnrollCourseView,
    MyCoursesView,
    CourseToggleStatusView
)
from .lessons import (
    LessonListCreateView,
    LessonDetailView,
    CompleteLessonView
)
from .quizzes import (
    QuizListCreateView,
    QuestionListCreateView,
    AttemptQuizView,
    QuizResultsView
)
from .analytics import (
    InstructorAnalyticsView,
    InstructorStudentListView
)
from .ratings import (
    CourseRatingCreateView,
    CourseRatingsListView
)
from .certificates import (
    GenerateCertificateView
)
from .notification_views import (
    NotificationListView,
    UnreadCountView,
    MarkNotificationReadView,
    MarkAllReadView,
    ClearNotificationsView
)
from .forum import (
    CommentListCreateView,
    CommentDeleteView
)
from .interactions import (
    WishlistListCreateView,
    WishlistDeleteView,
    LectureNoteListCreateView,
    LectureNoteUpdateDeleteView
)

__all__ = [
    # Authentication
    'RegisterView',
    'LoginView',
    
    # User Management
    'UserProfileView',
    
    # Course Management
    'CreateCourseView',
    'DeleteCourseView',
    'CourseDetailView',
    'PublishUnpublishCourseView',
    'EnrollCourseView',
    'MyCoursesView',
    'CourseToggleStatusView',
    
    # Lesson Management
    'LessonListCreateView',
    'LessonDetailView',
    'CompleteLessonView',
    
    # Quiz Management
    'QuizListCreateView',
    'QuestionListCreateView',
    'AttemptQuizView',
    'QuizResultsView',
    
    # Analytics
    'InstructorAnalyticsView',
    'InstructorStudentListView',
    
    # Ratings
    'CourseRatingCreateView',
    'CourseRatingsListView',
    
    # Certificates
    'GenerateCertificateView',
    
    # Notifications
    # Notifications
    'NotificationListView',
    'UnreadCountView',
    'MarkNotificationReadView',
    'MarkAllReadView',
    'ClearNotificationsView',
    
    # Forum
    'CommentListCreateView',
    'CommentDeleteView',
    
    # Interactions
    'WishlistListCreateView',
    'WishlistDeleteView',
    'LectureNoteListCreateView',
    'LectureNoteUpdateDeleteView',
]
