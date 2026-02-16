from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import User
from ..serializers import UserSerializer, AdminUserDetailSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        user = self.request.user
        user_id = self.request.query_params.get("user_id")

        # Use Admin Detail Serializer if Admin is viewing another user
        if user_id and (user.is_staff or getattr(user.role, "name", "") == "ADMIN"):
            return AdminUserDetailSerializer
        
        return UserSerializer

    def get_object(self):
        user = self.request.user

        # ✅ ADMIN OVERRIDE
        user_id = self.request.query_params.get("user_id")

        if user.is_staff or getattr(user.role, "name", "") == "ADMIN":
            if user_id:
                target_user = get_object_or_404(User, id=user_id)
                
                # 🚫 SECURITY: Admin cannot view other Admins
                if getattr(target_user.role, "name", "") == "ADMIN" and target_user != user:
                    raise PermissionDenied("You cannot view or edit other administrators.")

                return target_user

        # 👇 Default: return self
        return user
