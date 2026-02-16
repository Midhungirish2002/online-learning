"""
Certificate PDF Generator Utility
Generates professional PDF certificates for course completion.
"""
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors


def generate_certificate_pdf(student, course, completion_date):
    """
    Generate a professional PDF certificate for course completion.
    
    Args:
        student: User object (student who completed the course)
        course: Course object
        completion_date: datetime object (when the quiz was passed)
    
    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = BytesIO()
    
    # Create PDF with landscape A4 size
    page_width, page_height = landscape(A4)
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    
    # Certificate ID
    cert_id = f"CERT-{course.id}-{student.id}-{int(completion_date.timestamp())}"
    
    # Draw decorative border
    c.setStrokeColor(colors.HexColor('#3b82f6'))  # Blue color
    c.setLineWidth(3)
    c.rect(0.5 * inch, 0.5 * inch, page_width - 1 * inch, page_height - 1 * inch)
    
    # Inner border
    c.setStrokeColor(colors.HexColor('#8b5cf6'))  # Purple color
    c.setLineWidth(1)
    c.rect(0.7 * inch, 0.7 * inch, page_width - 1.4 * inch, page_height - 1.4 * inch)
    
    # Logo placeholder (you can replace with actual logo)
    c.setFillColor(colors.HexColor('#3b82f6'))
    c.circle(page_width / 2, page_height - 1.5 * inch, 0.4 * inch, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(page_width / 2, page_height - 1.6 * inch, "OLP")
    
    # Main heading
    c.setFillColor(colors.HexColor('#1e293b'))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(page_width / 2, page_height - 2.5 * inch, "Certificate of Completion")
    
    # Decorative line
    c.setStrokeColor(colors.HexColor('#8b5cf6'))
    c.setLineWidth(2)
    c.line(page_width / 2 - 2 * inch, page_height - 2.8 * inch, 
           page_width / 2 + 2 * inch, page_height - 2.8 * inch)
    
    # "This is to certify that"
    c.setFillColor(colors.HexColor('#475569'))
    c.setFont("Helvetica", 14)
    c.drawCentredString(page_width / 2, page_height - 3.4 * inch, "This is to certify that")
    
    # Student name (large and prominent)
    c.setFillColor(colors.HexColor('#1e293b'))
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(page_width / 2, page_height - 4 * inch, student.username)
    
    # Has successfully completed
    c.setFillColor(colors.HexColor('#475569'))
    c.setFont("Helvetica", 14)
    c.drawCentredString(page_width / 2, page_height - 4.5 * inch, "has successfully completed the course")
    
    # Course title
    c.setFillColor(colors.HexColor('#3b82f6'))
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(page_width / 2, page_height - 5.1 * inch, course.title)
    
    # Instructor name
    c.setFillColor(colors.HexColor('#475569'))
    c.setFont("Helvetica-Oblique", 12)
    c.drawCentredString(page_width / 2, page_height - 5.6 * inch, f"Instructed by {course.instructor.username}")
    
    # Date
    formatted_date = completion_date.strftime("%B %d, %Y")
    c.setFont("Helvetica", 12)
    c.drawCentredString(page_width / 2, page_height - 6.2 * inch, f"Completed on {formatted_date}")
    
    # Certificate ID (small, bottom)
    c.setFillColor(colors.HexColor('#94a3b8'))
    c.setFont("Helvetica", 8)
    c.drawCentredString(page_width / 2, 0.8 * inch, f"Certificate ID: {cert_id}")
    
    # Signature line (placeholder)
    c.setStrokeColor(colors.HexColor('#cbd5e1'))
    c.setLineWidth(1)
    signature_y = 1.5 * inch
    c.line(page_width / 2 - 1.5 * inch, signature_y, page_width / 2 + 1.5 * inch, signature_y)
    
    c.setFillColor(colors.HexColor('#64748b'))
    c.setFont("Helvetica", 10)
    c.drawCentredString(page_width / 2, signature_y - 0.3 * inch, "Online Learning Platform")
    c.drawCentredString(page_width / 2, signature_y - 0.5 * inch, "Authorized Signature")
    
    # Finalize PDF
    c.showPage()
    c.save()
    
    # Reset buffer position
    buffer.seek(0)
    return buffer
