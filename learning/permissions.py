from rest_framework import permissions
from django.shortcuts import get_object_or_404

from .models import RolePermission, Permission as PermissionModel

from rest_framework.permissions import BasePermission


class IsActiveUser(BasePermission):
    """
    Allows access only to active users.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        )


class IsInstructor(BasePermission):
    """
    Allows access only to INSTRUCTOR users.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.role.name == "INSTRUCTOR"
        )


class IsStudent(BasePermission):
    """
    Allows access only to STUDENT users.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.role.name == "STUDENT"
        )


class IsAdmin(BasePermission):
    """
    Allows access only to ADMIN users.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.role.name == "ADMIN"
        )

class IsActiveUser(permissions.BasePermission):
    """
    Deny access for authenticated users with is_active == False.
    Combined with IsAuthenticated globally.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return True  # let IsAuthenticated handle anonymous users
        return bool(getattr(user, "is_active", False))


class RoleRequired(permissions.BasePermission):
    """
    Generic role check: view must set required_role_name (e.g. 'INSTRUCTOR').
    """

    def has_permission(self, request, view):
        required = getattr(view, "required_role_name", None)
        if not required:
            return True
        role = getattr(getattr(request.user, "role", None), "name", None)
        if not role:
            return False
        return role.upper() == required.upper()


class HasPermissionCode(permissions.BasePermission):
    """
    View should provide permission_code attribute. Checks RolePermission and permission.is_active.
    """

    def has_permission(self, request, view):
        code = getattr(view, "permission_code", None)
        if not code:
            return True
        user = request.user
        if not getattr(user, "is_active", False):
            return False
        role = getattr(user, "role", None)
        if not role or not role.is_active:
            return False
        try:
            perm = PermissionModel.objects.get(code=code, is_active=True)
        except PermissionModel.DoesNotExist:
            return False
        return RolePermission.objects.filter(role=role, permission=perm).exists()
