from typing import List, Any
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer

from ..models import Course, Enrollment, QuizAttempt
from ..serializers import CourseSerializer, EnrollmentSerializer
from ..permissions import IsInstructor, IsStudent


class CreateCourseView(generics.ListCreateAPIView):
    """
    GET /courses/ -> List all published courses (Student/Public)
    GET /courses/?mine=true -> List my courses (Instructor Dashboard)
    POST /courses/ -> Create new course (Instructor only)
    """
    serializer_class = CourseSerializer

    def get_permissions(self) -> List[BasePermission]:
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsInstructor()]
        return [IsAuthenticated()]

    def get_queryset(self) -> QuerySet[Course]:
        # Filter for "My Courses" (Instructor Dashboard)
        if self.request.query_params.get("mine") == "true":
            return Course.objects.filter(instructor=self.request.user)
        
        # Default: List all published courses (Browse Page)
        return Course.objects.filter(is_published=True)

    def perform_create(self, serializer: BaseSerializer) -> None:
        serializer.save(instructor=self.request.user)


class DeleteCourseView(generics.DestroyAPIView):
    """
    Delete a course (Instructor only).
    """
    permission_classes = [IsAuthenticated, IsInstructor]
    queryset = Course.objects.all()

    def get_queryset(self) -> QuerySet[Course]:
        return Course.objects.filter(instructor=self.request.user)


class PublishUnpublishCourseView(APIView):
    """
    Instructor publishes or unpublishes a course.
    """
    permission_classes = [IsAuthenticated, IsInstructor]

    def patch(self, request: Request, course_id: int) -> Response:
        course = get_object_or_404(
            Course,
            pk=course_id,
            instructor=request.user
        )

        is_published = request.data.get("is_published")

        if is_published is None:
            return Response(
                {"error": "is_published field is required (true/false)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        course.is_published = is_published
        course.save()

        return Response(
            {
                "course_id": course.id,
                "is_published": course.is_published,
                "message": "Course published" if is_published else "Course unpublished"
            },
            status=status.HTTP_200_OK
        )


class EnrollCourseView(APIView):
    """
    Student enrolls in a course.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request: Request, course_id: int) -> Response:
        course = get_object_or_404(Course, pk=course_id, is_published=True)  # Students can only enroll if published
        user = request.user
        
        if Enrollment.objects.filter(student=user, course=course).exists():
            return Response({'error': 'Already enrolled'}, status=status.HTTP_400_BAD_REQUEST)

        enrollment = Enrollment.objects.create(student=user, course=course)
        
        # Send real-time notification
        from ..notifications import send_notification
        send_notification(
            user_id=user.id,
            notification_type='ENROLLED',
            message=f"Successfully enrolled in '{course.title}'",
            data={
                'course_id': course.id,
                'course_title': course.title,
                'instructor': course.instructor.username
            }
        )
        
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)


class CourseDetailView(generics.RetrieveAPIView):
    """
    Get course details.
    """
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class MyCoursesView(APIView):
    """
    List courses authenticated student is enrolled in with completion status.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request) -> Response:
        from ..models import QuizAttempt # Resolved Import
        user = request.user
        enrollments = Enrollment.objects.filter(student=user).select_related('course__instructor')

        courses_data = []
        for enrollment in enrollments:
            course = enrollment.course
            
            # Check if student has passed the quiz
            passed_attempt = QuizAttempt.objects.filter(
                student=user,
                quiz__course=course,
                is_passed=True
            ).order_by('-attempted_at').first()

            course_data = {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "instructor": course.instructor.username,
                "enrolled_at": enrollment.enrolled_at,
                "is_completed": passed_attempt is not None,
                "completion_date": passed_attempt.attempted_at if passed_attempt else None
            }
            courses_data.append(course_data)

        return Response(courses_data, status=status.HTTP_200_OK)


class CourseToggleStatusView(APIView):
    """
    Toggle course status (Active/Inactive).
    - Admins: Can toggle ANY course.
    - Instructors: Can toggle ONLY their own courses.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request: Request, course_id: int) -> Response:
        # Use all_objects to find even inactive courses
        course = get_object_or_404(Course.all_objects, id=course_id)
        user = request.user

        # Permission Check
        is_admin = getattr(user.role, "name", "") == "ADMIN" or user.is_staff
        is_instructor = getattr(user.role, "name", "") == "INSTRUCTOR"
        is_owner = course.instructor == user

        if not (is_admin or (is_instructor and is_owner)):
             return Response(
                {"error": "You do not have permission to modify this course."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Toggle Logic
        previous_status = "Active" if course.is_active else "Inactive"
        course.is_active = not course.is_active
        course.save()
        
        new_status = "Active" if course.is_active else "Inactive"
        action = "activated" if course.is_active else "deactivated"

        return Response({
            "course_id": course.id,
            "previous_status": previous_status,
            "new_status": new_status,
            "action_performed": action,
            "message": f"Course successfully {action}"
        }, status=status.HTTP_200_OK)
