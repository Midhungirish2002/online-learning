from django.shortcuts import get_object_or_404
from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..models import Course, Enrollment, CourseRating
from ..serializers import CourseRatingSerializer
from ..permissions import IsStudent


class CourseRatingCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)

        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course,
            is_active=True
        ).exists()

        if not enrolled:
            return Response(
                {"error": "You must be enrolled to rate this course"},
                status=403
            )

        serializer = CourseRatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        CourseRating.objects.create(
            student=request.user,
            course=course,
            rating=serializer.validated_data["rating"],
            feedback=serializer.validated_data.get("feedback", "")
        )

        return Response(
            {"message": "Course rated successfully"},
            status=201
        )


class CourseRatingsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)

        ratings = CourseRating.objects.filter(
            course=course
        ).order_by("-created_at")

        avg_rating = ratings.aggregate(
            Avg("rating")
        )["rating__avg"] or 0

        serializer = CourseRatingSerializer(ratings, many=True)

        return Response({
            "course_id": course.id,
            "course_title": course.title,
            "average_rating": round(avg_rating, 2),
            "total_ratings": ratings.count(),
            "ratings": serializer.data
        }, status=200)
