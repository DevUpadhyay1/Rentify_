# permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnlyApproval(BasePermission):
    """
    - All users can read and suggest categories (POST)
    - Only admin can approve, update or delete
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method == 'POST':
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff
