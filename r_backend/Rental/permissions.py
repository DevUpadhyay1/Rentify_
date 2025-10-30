from rest_framework import permissions

class IsRenterOrOwner(permissions.BasePermission):
    """
    Allow access if user is renter or owner; otherwise deny.
    """

    def has_object_permission(self, request, view, obj):
        return request.user and (obj.renter == request.user or obj.owner == request.user)

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and (obj.owner == request.user)
