# Rental/urls.py

from django.urls import path
from .views import (
    BookingListCreateView,
    BookingRetrieveUpdateDestroyView,
    BookingOwnerAcceptView,
    BookingRenterConfirmView,
    BookingCancelView,
    BookingAssignLogisticsView,
    BookingReturnView,
    BookingExtendView,
    BookingCompleteView,
)

urlpatterns = [
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingRetrieveUpdateDestroyView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/owner_accept/', BookingOwnerAcceptView.as_view(), name='booking-owner-accept'),
    path('bookings/<int:pk>/renter_confirm/', BookingRenterConfirmView.as_view(), name='booking-renter-confirm'),
    path('bookings/<int:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('bookings/<int:pk>/assign_logistics/', BookingAssignLogisticsView.as_view(), name='booking-assign-logistics'),
    path('bookings/<int:pk>/return/', BookingReturnView.as_view(), name='booking-return'),
    path('bookings/<int:pk>/extend/', BookingExtendView.as_view(), name='booking-extend'),
    path('bookings/<int:pk>/complete/', BookingCompleteView.as_view(), name='booking-complete'),
]