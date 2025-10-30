from rest_framework import permissions


class IsBillOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow bill access to:
    - Admin users
    - Renter (who needs to pay the bill)
    - Owner (who needs to confirm payment received)
    """
    
    def has_permission(self, request, view):
        # All authenticated users can access (object-level check below)
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user and request.user.is_staff:
            return True
        
        # Allow if user is the renter (person who booked and needs to pay)
        if obj.booking.renter == request.user:
            return True
        
        # Allow if user is the owner (item owner who receives payment)
        if obj.booking.owner == request.user:
            return True
        
        return False


class IsRefundOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow refund requester or admin to access.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user and request.user.is_staff:
            return True
        
        # Refund requester can access
        return obj.requested_by == request.user