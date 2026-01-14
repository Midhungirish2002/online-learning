
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from learning.models import Role, Course, Lesson, Quiz, Question, Enrollment, QuizAttempt, LessonProgress, CourseRating

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial data for the application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        created_users = []

        try:
            with transaction.atomic():
                # 1. Create Roles
                roles = ['ADMIN', 'INSTRUCTOR', 'STUDENT']
                role_objects = {}
                for role_name in roles:
                    role, created = Role.objects.get_or_create(name=role_name)
                    role_objects[role_name] = role
                    if created:
                        self.stdout.write(f'Created role: {role_name}')

                # 2. Create Users
                # Admin
                admin_user, created = User.objects.get_or_create(
                    username='admin',
                    defaults={
                        'email': 'admin@example.com',
                        'role': role_objects['ADMIN'],
                        'is_staff': True,
                        'is_superuser': True
                    }
                )
                if created:
                    admin_user.set_password('admin123')
                    admin_user.save()
                    created_users.append(f'Admin: {admin_user.username} / admin123')
                    self.stdout.write(f'Created admin: {admin_user.username}')

                # Instructor
                instructor, created = User.objects.get_or_create(
                    username='instructor1',
                    defaults={
                        'email': 'instructor1@example.com',
                        'role': role_objects['INSTRUCTOR'],
                        'is_staff': True
                    }
                )
                if created:
                    instructor.set_password('password123')
                    instructor.save()
                    created_users.append(f'Instructor: {instructor.username} / password123')
                    self.stdout.write(f'Created instructor: {instructor.username}')
                
                # Students
                students = []
                for i in range(1, 4):
                    student, created = User.objects.get_or_create(
                        username=f'student{i}',
                        defaults={
                            'email': f'student{i}@example.com',
                            'role': role_objects['STUDENT']
                        }
                    )
                    if created:
                        student.set_password('password123')
                        student.save()
                        created_users.append(f'Student: {student.username} / password123')
                        self.stdout.write(f'Created student: {student.username}')
                    students.append(student)

                # 3. Create Course
                course, created = Course.objects.get_or_create(
                    title='Intro to Django',
                    instructor=instructor,
                    defaults={
                        'description': 'A comprehensive guide to Django REST Framework.',
                        'is_published': True
                    }
                )
                if created:
                     self.stdout.write(f'Created course: {course.title}')

                # 4. Create Lessons
                lessons = []
                for i in range(1, 6):
                    lesson, created = Lesson.objects.get_or_create(
                        course=course,
                        lesson_order=i,
                        defaults={
                            'title': f'Django Lesson {i}',
                            'content': f'Content for lesson {i}. Django is a high-level Python web framework...'
                        }
                    )
                    if created:
                         self.stdout.write(f'Created lesson: {lesson.title}')
                    lessons.append(lesson)

                # 5. Create Quiz
                quiz, created = Quiz.objects.get_or_create(
                    course=course,
                    defaults={
                        'total_marks': 10,
                        'pass_marks': 5
                    }
                )
                if created:
                    self.stdout.write(f'Created quiz for course: {course.title}')

                # 6. Create Questions
                questions_data = [
                   {
                       'text': 'What is Django?',
                       'a': 'A web framework', 'b': 'A reptile', 'c': 'A movie', 'd': 'None', 'correct': 'A'
                   },
                   {
                       'text': 'Which file logs url patterns?',
                       'a': 'models.py', 'b': 'views.py', 'c': 'urls.py', 'd': 'tests.py', 'correct': 'C'
                   }
                ]
                
                for q_data in questions_data:
                    Question.objects.get_or_create(
                        quiz=quiz,
                        question_text=q_data['text'],
                        defaults={
                            'option_a': q_data['a'],
                            'option_b': q_data['b'],
                            'option_c': q_data['c'],
                            'option_d': q_data['d'],
                            'correct_option': q_data['correct']
                        }
                    )

                # 7. Enroll Students & Generate Activity
                for student in students:
                    enrollment, created = Enrollment.objects.get_or_create(
                        student=student,
                        course=course
                    )
                    if created:
                        self.stdout.write(f'Enrolled {student.username} in {course.title}')
                    
                    # Mark first 2 lessons as complete for student1
                    if student.username == 'student1':
                        for lesson in lessons[:2]:
                            LessonProgress.objects.get_or_create(
                                enrollment=enrollment,
                                lesson=lesson,
                                defaults={'completed_at': '2025-01-01 10:00:00+00:00'} # Using string for simplicity, ideally datetime
                            )
                        
                        # Use timezone in real app, but here we let django handle casting or defaults if simpler
                        # Attempt quiz
                        QuizAttempt.objects.create(
                            student=student,
                            quiz=quiz,
                            score=8.0,
                            is_passed=True
                        )
                        self.stdout.write(f'Created quiz attempt for {student.username}')
                        
                        # Rate course
                        CourseRating.objects.get_or_create(
                            student=student,
                            course=course,
                            defaults={
                                'rating': 5,
                                'feedback': 'Great course!'
                            }
                        )

        except Exception as e:
             self.stdout.write(self.style.ERROR(f'Error seeding data: {str(e)}'))
             # Re-raise to see stack trace if needed, or just return
             raise e

        self.stdout.write(self.style.SUCCESS('Successfully seeded data'))
        if created_users:
            self.stdout.write(self.style.WARNING("\nNew Accounts Created:"))
            for u in created_users:
                self.stdout.write(u)
        else:
             self.stdout.write("\nNo new users created (already existed). Credentials are as defined in the script.")
