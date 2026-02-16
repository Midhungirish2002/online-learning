from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg
from django.http import HttpResponse
import csv
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from .permissions import IsAdmin
from .models import Course, Enrollment, Quiz, QuizAttempt, User

User = get_user_model()

# =======================
# ADMIN DASHBOARD & ANALYTICS
# =======================

class AdminDashboardView(APIView):
    """
    Admin checks system stats.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        stats = {
            "users_count": User.objects.count(),
            "courses_count": Course.objects.count(),
            "enrollments_count": Enrollment.objects.count(),
            "quizzes_count": Quiz.objects.count(),
        }
        return Response(stats)


class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users_by_role = (
            User.objects
            .values("role__name")
            .annotate(count=Count("id"))
        )

        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(is_published=True).count()
        total_enrollments = Enrollment.objects.count()

        total_attempts = QuizAttempt.objects.count()
        passed_attempts = QuizAttempt.objects.filter(is_passed=True).count()

        pass_rate = (
            round((passed_attempts / total_attempts) * 100, 2)
            if total_attempts > 0 else 0
        )

        return Response({
            "users_by_role": {
                item["role__name"]: item["count"]
                for item in users_by_role
            },
            "courses": {
                "total": total_courses,
                "published": published_courses,
            },
            "enrollments": total_enrollments,
            "quiz_pass_rate_percent": pass_rate,
        })


class ExportStudentResultsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_content_negotiation(self, request, force=False):
        # Bypass DRF content negotiation to prevent 404 on ?format=excel
        return (self.get_renderers()[0], '*/*')

    def get(self, request):
        export_format = request.query_params.get("format", "").lower()

        if export_format == "excel":
            return self.export_excel()

        if export_format == "pdf":
            return self.export_pdf()

        return Response(
            {"error": "Invalid or missing format. Use ?format=excel or ?format=pdf"},
            status=400
        )

    def get_queryset(self):
        return QuizAttempt.objects.select_related(
            "student", "quiz", "quiz__course"
        )

    def export_excel(self):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="quiz_results.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "Student",
            "Course",
            "Quiz ID",
            "Score",
            "Passed",
            "Attempted At"
        ])

        for a in self.get_queryset():
            writer.writerow([
                a.student.username,
                a.quiz.course.title,
                a.quiz.id,
                a.score,
                "YES" if a.is_passed else "NO",
                a.attempted_at.strftime("%Y-%m-%d %H:%M")
            ])

        return response

    def export_pdf(self):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="quiz_results.pdf"'

        doc = SimpleDocTemplate(response, pagesize=A4)
        elements = []

        # Title
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Student Quiz Results Report", styles["Title"]))

        # Table Data
        data = [["Student", "Course", "Score", "Status", "Date"]]
        
        for a in self.get_queryset():
            data.append([
                a.student.username,
                a.quiz.course.title,
                str(a.score),
                "PASSED" if a.is_passed else "FAILED",
                a.attempted_at.strftime("%Y-%m-%d")
            ])

        # Table Formatting
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))

        elements.append(table)
        doc.build(elements)
        return response


# =======================
# ADMIN USER MANAGEMENT
# =======================

class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        role_filter = request.query_params.get("role")
        
        # Explicit fields as requested
        queryset = User.objects.select_related("role").all().order_by("-id")

        if role_filter and role_filter != "ALL":
            queryset = queryset.filter(role__name=role_filter)

        data = []
        for user in queryset:
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name, # Role is required field
                "is_active": user.is_active,
            })

        return Response(data, status=status.HTTP_200_OK)


class AdminToggleUserStatusView(APIView):
    """
    Toggle user status (Active/Inactive).
    - Admins only.
    - Admins cannot toggle other admins' status.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        # Prevent admins from toggling other admins
        if user.role.name == "ADMIN":
            return Response({
                "error": "Cannot toggle status of admin users",
                "message": "You are not allowed to modify another administrator's status"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Toggle Logic
        previous_status = "Active" if user.is_active else "Inactive"
        user.is_active = not user.is_active
        user.save()
        
        new_status = "Active" if user.is_active else "Inactive"
        action = "activated" if user.is_active else "deactivated"

        return Response({
            "user_id": user.id,
            "previous_status": previous_status,
            "new_status": new_status,
            "action_performed": action,
            "message": f"User successfully {action}"
        }, status=status.HTTP_200_OK)


# =======================
# SOFT DELETE & DEPRECATED
# =======================

class AdminUserDeactivateView(APIView):
    """
    Admin deactivates a user (Soft Delete).
    Prevent login.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.is_active = False
        user.save()
        return Response({"message": "User deactivated successfully"}, status=status.HTTP_200_OK)


class AdminReactivateUserView(APIView):
    """
    Admin reactivates a user.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        if user.is_active:
            return Response(
                {"error": "User is already active"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.is_active = True
        user.save()
        return Response({"message": "User activated successfully"}, status=status.HTTP_200_OK)


class AdminCourseDeactivateView(APIView):
    """
    Admin deactivates a course (Soft Delete).
    Hides from students/instructors.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, course_id):
        # We can deactivate an already active course
        course = get_object_or_404(Course, id=course_id)
        course.is_active = False
        course.save()
        return Response({"message": "Course deactivated successfully"}, status=status.HTTP_200_OK)
