"""
Certificate Generation Views
"""
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..models import Course, QuizAttempt
from ..utils.certificate_generator import generate_certificate_pdf


class GenerateCertificateView(APIView):
    """
    Generate and download PDF certificate for completed course.
    Only available to students who have passed the course quiz.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user
        course = get_object_or_404(Course, pk=course_id, is_published=True)

        # 1. Check if student has passed the quiz
        passed_attempt = QuizAttempt.objects.filter(
            student=user,
            quiz__course=course,
            is_passed=True
        ).order_by('-attempted_at').first()

        if not passed_attempt:
            return Response(
                {"error": "You must complete and pass the course quiz to receive a certificate."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Generate PDF certificate
        try:
            pdf_buffer = generate_certificate_pdf(
                student=user,
                course=course,
                completion_date=passed_attempt.attempted_at
            )

            # 3. Create HTTP response with PDF
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            filename = f"certificate_{course.title.replace(' ', '_')}_{user.username}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'

            return response

        except Exception as e:
            return Response(
                {"error": f"Failed to generate certificate: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
