from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from learning.models import Role

User = get_user_model()

class ExportApiTest(APITestCase):
    def setUp(self):
        self.role, _ = Role.objects.get_or_create(name="ADMIN")
        self.user = User.objects.create_user(
            username='adminuser', 
            email='admin@example.com', 
            password='password123',
            role=self.role
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_export_url_resolution(self):
        url = "/api/admin-api/export-results/"
        print(f"Testing URL: {url}")
        
        response = self.client.get(url + "?format=excel")
        print(f"Response Code: {response.status_code}")
        if response.status_code == 404:
            print("404 Not Found")
            print(f"Response data: {response.data}")
        else:
            print(f"Found! Status: {response.status_code}")
