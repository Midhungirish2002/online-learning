from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from ..models import User
from ..serializers import RegisterUserSerializer, CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    Register a new user (Student/Instructor).
    """
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """
    Login using SimpleJWT.
    Supports Username OR Email.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
