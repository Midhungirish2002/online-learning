import os
import django
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model

# Setup Django (assuming this is run with manage.py test or equivalent environment)
# If standalone, we'd need to set DJANGO_SETTINGS_MODULE
# But I'll write this as a standard Django test case file I can run via 'python manage.py test learning.tests'

User = get_user_model()

class ProfileUploadTest(APITestCase):
    def setUp(self):
        from .models import Role
        self.role, _ = Role.objects.get_or_create(name="STUDENT")
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='password123',
            role=self.role
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/profile/'

    def test_upload_profile_image(self):
        # Create a simple image file
        image_content = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x01\x44\x00\x3b'
        image = SimpleUploadedFile('test_image.gif', image_content, content_type='image/gif')

        # Perform PATCH request with multipart/form-data
        data = {'profile_image': image}
        response = self.client.patch(self.url, data, format='multipart')

        if response.status_code != status.HTTP_200_OK:
            print(f"Failed: {response.status_code} - {response.data}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh user
        self.user.refresh_from_db()
        self.assertTrue(bool(self.user.profile_image))
        print(f"Image uploaded to: {self.user.profile_image.name}")
