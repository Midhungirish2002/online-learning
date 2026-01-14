print(">>> LOADED learning.urls.py <<<")
from .models import Role

from django.urls import path
from .views import CourseRatingCreateView, CourseRatingsListView
from .views import (
    RegisterView,
    LoginView,
    UserProfileView,
    CreateCourseView,
    PublishUnpublishCourseView,
    EnrollCourseView,
    MyCoursesView,
    LessonListCreateView,
    CompleteLessonView,
    CreateQuizView,
    CreateQuestionView,
    AttemptQuizView,
    QuizResultsView,
    AdminDashboardView,AdminAnalyticsView,    
    InstructorAnalyticsView,
    ExportStudentResultsView,
    AdminUserDeactivateView, AdminReactivateUserView, AdminToggleUserStatusView,
    AdminCourseDeactivateView, CourseToggleStatusView
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", UserProfileView.as_view()),
    path("admin-api/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("instructor/analytics/", InstructorAnalyticsView.as_view(), name="instructor-analytics"),
    path("courses/", CreateCourseView.as_view()),
    path("courses/<int:course_id>/publish/", PublishUnpublishCourseView.as_view()),
    path("courses/<int:course_id>/enroll/", EnrollCourseView.as_view()),
    path("my-courses/", MyCoursesView.as_view()),
    path("courses/<int:course_id>/rate/", CourseRatingCreateView.as_view(), name="course-rate"),
    path("courses/<int:course_id>/ratings/", CourseRatingsListView.as_view(), name="course-ratings"),
    path("courses/<int:course_id>/lessons/", LessonListCreateView.as_view()),
    path("lessons/<int:lesson_id>/complete/", CompleteLessonView.as_view()),

    path("quizzes/", CreateQuizView.as_view()),
    path("quizzes/<int:quiz_id>/questions/", CreateQuestionView.as_view()),
    path("quizzes/<int:quiz_id>/attempt/", AttemptQuizView.as_view()),
    path("quizzes/<int:quiz_id>/results/", QuizResultsView.as_view()),

    # ✅ ADMIN
    path("admin-api/dashboard/", AdminDashboardView.as_view()),
    path("admin-api/export-results/", ExportStudentResultsView.as_view()),
    
    # Soft Delete
    path("admin-api/users/<int:user_id>/deactivate/", AdminUserDeactivateView.as_view()),
    path("admin-api/users/<int:user_id>/reactivate/", AdminReactivateUserView.as_view()),
    path("admin-api/users/<int:user_id>/toggle-status/", AdminToggleUserStatusView.as_view()),
    path("admin-api/courses/<int:course_id>/deactivate/", AdminCourseDeactivateView.as_view()),
    path("admin-api/courses/<int:course_id>/toggle-status/", CourseToggleStatusView.as_view()),
]
