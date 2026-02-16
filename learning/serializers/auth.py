from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from ..models import User, Role


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to allow login with Email OR Username.
    """
    def validate(self, attrs):
        username_input = attrs.get("username")

        if username_input:
            # Check if input is an email
            user = User.objects.filter(email=username_input).first()
            if user:
                attrs["username"] = user.username  # Swap email for username
        
        return super().validate(attrs)


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        role_name = validated_data.pop("role")

        if role_name not in ["ADMIN", "INSTRUCTOR", "STUDENT"]:
            raise serializers.ValidationError(
                {"role": "Invalid role. Must be ADMIN, INSTRUCTOR, or STUDENT."}
            )

        try:
            role_obj = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Role does not exist."})

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=role_obj
        )
        return user
