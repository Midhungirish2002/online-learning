print(">>> LOADED learning.urls.py <<<")
from .models import Role

from django.urls import path
from .views import CourseRatingCreateView, CourseRatingsListView
from .views import (
    RegisterView,
    LoginView,
    UserProfileView,
    CreateCourseView,
    DeleteCourseView,
    CourseDetailView,
    PublishUnpublishCourseView,
    EnrollCourseView,
    MyCoursesView,
    LessonListCreateView,
    LessonDetailView,
    CompleteLessonView,
    QuizListCreateView,
    QuestionListCreateView,
    AttemptQuizView,
    QuizResultsView,
    InstructorAnalyticsView, 
    InstructorStudentListView,
    CourseToggleStatusView,
    GenerateCertificateView,
    NotificationListView,
    UnreadCountView,
    MarkNotificationReadView,
    MarkAllReadView,
    ClearNotificationsView,
    CommentListCreateView,
    CommentDeleteView,
    WishlistListCreateView,
    WishlistDeleteView,
    LectureNoteListCreateView,
    LectureNoteUpdateDeleteView
)
from .admin_views import (
    AdminDashboardView,
    AdminAnalyticsView,
    ExportStudentResultsView,
    AdminUserDeactivateView,
    AdminReactivateUserView,
    AdminToggleUserStatusView,
    AdminCourseDeactivateView,
    AdminUserListView
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", UserProfileView.as_view()),
    path("admin-api/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("instructor/analytics/", InstructorAnalyticsView.as_view(), name="instructor-analytics"),
    path("instructor/students/", InstructorStudentListView.as_view(), name="instructor-students"),
    path("courses/", CreateCourseView.as_view()),
    path("courses/<int:pk>/", CourseDetailView.as_view()),
    path("courses/<int:pk>/delete/", DeleteCourseView.as_view()),
    path("courses/<int:course_id>/publish/", PublishUnpublishCourseView.as_view()),
    path("courses/<int:course_id>/enroll/", EnrollCourseView.as_view()),
    path("my-courses/", MyCoursesView.as_view()),
    path("courses/<int:course_id>/rate/", CourseRatingCreateView.as_view(), name="course-rate"),
    path("courses/<int:course_id>/ratings/", CourseRatingsListView.as_view(), name="course-ratings"),
    path("courses/<int:course_id>/lessons/", LessonListCreateView.as_view()),
    path("lessons/<int:pk>/", LessonDetailView.as_view()),
    path("lessons/<int:lesson_id>/complete/", CompleteLessonView.as_view()),
    
    path("courses/<int:course_id>/quizzes/", QuizListCreateView.as_view()),
    path("courses/<int:course_id>/quizzes/", QuizListCreateView.as_view()),
    path("quizzes/<int:quiz_id>/questions/", QuestionListCreateView.as_view()),
    path("quizzes/<int:quiz_id>/attempt/", AttemptQuizView.as_view()),
    path("quizzes/<int:quiz_id>/results/", QuizResultsView.as_view()),
    
    # Certificates
    path("certificates/<int:course_id>/", GenerateCertificateView.as_view(), name="generate-certificate"),

    # ✅ ADMIN
    path("admin-api/dashboard/", AdminDashboardView.as_view()),
    path("admin-api/export-results/", ExportStudentResultsView.as_view()),
    path("admin-api/users/", AdminUserListView.as_view(), name="admin-user-list"),

    
    # Soft Delete
    path("admin-api/users/<int:user_id>/deactivate/", AdminUserDeactivateView.as_view()),
    path("admin-api/users/<int:user_id>/reactivate/", AdminReactivateUserView.as_view()),
    path("admin-api/users/<int:user_id>/toggle-status/", AdminToggleUserStatusView.as_view()),
    path("admin-api/courses/<int:course_id>/deactivate/", AdminCourseDeactivateView.as_view()),
    path("admin-api/courses/<int:course_id>/toggle-status/", CourseToggleStatusView.as_view()),
    
    # Notifications
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("notifications/unread-count/", UnreadCountView.as_view(), name="notification-unread-count"),
    path("notifications/<int:notification_id>/read/", MarkNotificationReadView.as_view(), name="notification-mark-read"),
    path("notifications/mark-all-read/", MarkAllReadView.as_view(), name="notification-mark-all-read"),
    path("notifications/clear/", ClearNotificationsView.as_view(), name="notification-clear"),
    
    # Forum
    path("courses/<int:course_id>/comments/", CommentListCreateView.as_view(), name="comment-list-create"),
    path("comments/<int:pk>/", CommentDeleteView.as_view(), name="comment-delete"),
    
    # Wishlist & Notes
    path("wishlist/", WishlistListCreateView.as_view(), name="wishlist-list-create"),
    path("wishlist/<int:wishlist_id>/", WishlistDeleteView.as_view(), name="wishlist-delete"),
    path("notes/", LectureNoteListCreateView.as_view(), name="notes-list-create"),
    path("notes/<int:note_id>/", LectureNoteUpdateDeleteView.as_view(), name="notes-update-delete"),
]
