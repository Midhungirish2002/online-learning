from datetime import timedelta
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

ROLE_LIFETIMES = {
    "ADMIN": timedelta(minutes=30),
    "INSTRUCTOR": timedelta(minutes=15),
    "STUDENT": timedelta(minutes=5),
}


class CustomRefreshToken(RefreshToken):
    """
    Subclass RefreshToken to add custom claims and set dynamic access token expiry.
    Use CustomRefreshToken.for_user(user) in LoginView.
    """

    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)

        # Add claims on refresh token
        token["user_id"] = int(getattr(user, "id"))
        token["username"] = getattr(user, "username", "")
        role_name = getattr(getattr(user, "role", None), "name", "")
        token["role"] = role_name

        # Customize access token claims and expiry
        access = token.access_token
        access["user_id"] = token["user_id"]
        access["username"] = token["username"]
        access["role"] = token["role"]

        lifetime = ROLE_LIFETIMES.get(str(role_name).upper(), timedelta(minutes=5))
        exp_dt = timezone.now() + lifetime
        access["exp"] = int(exp_dt.timestamp())

        return token