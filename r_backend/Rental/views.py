from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from datetime import timedelta

from .models import Booking, BookingHistory
from .serializers import BookingSerializer, BookingCreateSerializer
from .permissions import IsRenterOrOwner, IsOwner
from .utils import (
    notify_admin_booking_requested,
    notify_owner_booking_requested,
    notify_renter_status,
    notify_third_party,
    notify_booking_extension,
)


class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/    -> list all bookings of logged-in user
    POST /api/bookings/    -> create a new booking (status = pending)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            qs = Booking.objects.all().select_related('item', 'renter', 'owner')
        else:
            qs = Booking.objects.filter(
                models.Q(renter=user) | models.Q(owner=user)
            ).select_related('item', 'renter', 'owner')
        
        # Filter by item if provided
        item_id = self.request.query_params.get('item')
        if item_id:
            qs = qs.filter(item_id=item_id)
        
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        item = serializer.validated_data['item']
        owner = getattr(item, 'owner', None)
        
        if owner is None:
            raise ValueError("Item must have an owner set.")

        # Create booking with pending status
        booking = serializer.save(renter=self.request.user, owner=owner)
        
        print(f"📝 NEW BOOKING - Booking {booking.id} created for Item {item.id}")
    
        # Notify relevant parties
        try:
            notify_admin_booking_requested(booking)
            notify_owner_booking_requested(booking)
        except Exception as e:
            print(f"❌ Notification error: {e}")

        return booking


class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all().select_related('item', 'renter', 'owner')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsRenterOrOwner]


class BookingOwnerAcceptView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/owner_accept/
    Owner accepts booking request - marks item as rented
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status != Booking.STATUS_PENDING:
            return Response(
                {"detail": "Booking is not in pending state."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        prev_status = booking.status
        booking.status = Booking.STATUS_ACCEPTED_BY_OWNER
        booking.owner_note = request.data.get('owner_note', '')
        booking.save()

        # ✅ FIXED: Use UPPERCASE to match database
        item = booking.item
        item.availability_status = "RENTED"
        item.save(update_fields=["availability_status"])
        
        print(f"✅ OWNER ACCEPT - Booking {booking.id} accepted, Item {item.id} marked as RENTED")

        BookingHistory.objects.create(
            booking=booking,
            previous_status=prev_status,
            new_status=booking.status,
            changed_by=request.user,
            note=request.data.get('owner_note', '')
        )
        
        try:
            notify_renter_status(booking, actor='owner', action='accepted')
        except Exception as e:
            print(f"❌ Notification error: {e}")
        
        # Refresh to get bill created by signal
        booking.refresh_from_db()
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingRenterConfirmView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/renter_confirm/
    Renter confirms booking after owner accepted
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status != Booking.STATUS_ACCEPTED_BY_OWNER:
            return Response(
                {"detail": "Booking not in accepted_by_owner state."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if booking.renter != request.user:
            return Response(
                {"detail": "Only renter can confirm."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        prev_status = booking.status
        booking.status = Booking.STATUS_CONFIRMED
        booking.save()

        # ✅ FIXED: Use UPPERCASE to match database
        item = booking.item
        item.availability_status = "RENTED"
        item.save(update_fields=["availability_status"])
        
        print(f"✅ RENTER CONFIRM - Booking {booking.id} confirmed, Item {item.id} kept as RENTED")

        BookingHistory.objects.create(
            booking=booking,
            previous_status=prev_status,
            new_status=booking.status,
            changed_by=request.user,
            note=request.data.get('note', '')
        )

        try:
            notify_renter_status(booking, actor='renter', action='confirmed')
            if booking.third_party_required:
                notify_third_party(booking)
        except Exception as e:
            print(f"❌ Notification error: {e}")

        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingCancelView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/cancel/
    Either owner or renter cancels booking
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsRenterOrOwner]

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status == Booking.STATUS_CANCELLED:
            return Response(
                {"detail": "Already cancelled."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        prev_status = booking.status
        item = booking.item
        
        print(f"🔍 CANCEL - Booking {booking.id} (Status: {prev_status}), Item {item.id} (Status: {item.availability_status})")
        
        # Check for OTHER active bookings BEFORE changing this booking's status
        other_active_bookings = Booking.objects.filter(
            item=item,
            status__in=[
                Booking.STATUS_ACCEPTED_BY_OWNER,
                Booking.STATUS_CONFIRMED
            ]
        ).exclude(pk=booking.pk)
        
        print(f"🔍 CANCEL - Found {other_active_bookings.count()} other active bookings for Item {item.id}")
        
        # Change booking status
        booking.status = Booking.STATUS_CANCELLED
        booking.save()
        
        # ✅ FIXED: Use UPPERCASE to match database
        if not other_active_bookings.exists():
            item.availability_status = "AVAILABLE"
            item.save(update_fields=["availability_status"])
            item.refresh_from_db()
            print(f"✅✅✅ CANCEL - Item {item.id} marked as AVAILABLE (verified: {item.availability_status})")
        else:
            print(f"⚠️ CANCEL - Item {item.id} has other active bookings, keeping RENTED status")

        BookingHistory.objects.create(
            booking=booking,
            previous_status=prev_status,
            new_status=booking.status,
            changed_by=request.user,
            note=request.data.get('note', 'Booking cancelled')
        )

        try:
            notify_renter_status(booking, actor=request.user, action='cancelled')
        except Exception as e:
            print(f"❌ Notification error: {e}")
            
        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingReturnView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/return/
    Mark booking as returned - makes item available again
    """
    permission_classes = [permissions.IsAuthenticated, IsRenterOrOwner]
    serializer_class = BookingSerializer

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status != Booking.STATUS_CONFIRMED:
            return Response(
                {'detail': 'Booking is not currently active.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        prev_status = booking.status
        item = booking.item
        
        print(f"🔍 RETURN - Booking {booking.id} (Status: {prev_status}), Item {item.id} (Status: {item.availability_status})")
        
        # Check for OTHER active bookings BEFORE changing this booking's status
        other_active_bookings = Booking.objects.filter(
            item=item,
            status__in=[
                Booking.STATUS_ACCEPTED_BY_OWNER,
                Booking.STATUS_CONFIRMED
            ]
        ).exclude(pk=booking.pk)
        
        print(f"🔍 RETURN - Found {other_active_bookings.count()} other active bookings for Item {item.id}")
        for other in other_active_bookings:
            print(f"   📌 Booking {other.id}: {other.status}")
        
        # Change booking status to completed
        booking.status = Booking.STATUS_COMPLETED
        booking.save()
        
        # ✅ FIXED: Use UPPERCASE to match database
        if not other_active_bookings.exists():
            item.availability_status = "AVAILABLE"
            item.save(update_fields=["availability_status"])
            item.refresh_from_db()
            print(f"✅✅✅ RETURN - Item {item.id} marked as AVAILABLE (verified: {item.availability_status})")
        else:
            print(f"⚠️ RETURN - Item {item.id} has {other_active_bookings.count()} other active bookings, keeping RENTED status")
        
        BookingHistory.objects.create(
            booking=booking,
            previous_status=prev_status,
            new_status=booking.status,
            changed_by=request.user,
            note=request.data.get('note', 'Item returned')
        )
        
        try:
            notify_renter_status(booking, actor='system', action='returned')
        except Exception as e:
            print(f"❌ Notification error: {e}")
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingCompleteView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/complete/
    Owner marks booking as completed - makes item available again
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    serializer_class = BookingSerializer

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status not in [Booking.STATUS_CONFIRMED]:
            return Response(
                {'detail': 'Only confirmed bookings can be completed.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        prev_status = booking.status
        item = booking.item
        
        print(f"🔍 COMPLETE - Booking {booking.id} (Status: {prev_status}), Item {item.id} (Status: {item.availability_status})")
        
        # Check for OTHER active bookings BEFORE changing this booking's status
        other_active_bookings = Booking.objects.filter(
            item=item,
            status__in=[
                Booking.STATUS_ACCEPTED_BY_OWNER,
                Booking.STATUS_CONFIRMED
            ]
        ).exclude(pk=booking.pk)
        
        print(f"🔍 COMPLETE - Found {other_active_bookings.count()} other active bookings for Item {item.id}")
        for other in other_active_bookings:
            print(f"   📌 Booking {other.id}: {other.status}")
        
        # Change booking status to completed
        booking.status = Booking.STATUS_COMPLETED
        booking.save()
        
        # ✅ FIXED: Use UPPERCASE to match database
        if not other_active_bookings.exists():
            item.availability_status = "AVAILABLE"
            item.save(update_fields=["availability_status"])
            item.refresh_from_db()
            print(f"✅✅✅ COMPLETE - Item {item.id} marked as AVAILABLE (verified: {item.availability_status})")
        else:
            print(f"⚠️ COMPLETE - Item {item.id} has {other_active_bookings.count()} other active bookings, keeping RENTED status")
        
        BookingHistory.objects.create(
            booking=booking,
            previous_status=prev_status,
            new_status=booking.status,
            changed_by=request.user,
            note='Booking completed by owner'
        )
        
        try:
            notify_renter_status(booking, actor='system', action='completed')
        except Exception as e:
            print(f"❌ Notification error: {e}")
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingExtendView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/extend/
    Extend the rental period
    """
    permission_classes = [permissions.IsAuthenticated, IsRenterOrOwner]
    serializer_class = BookingSerializer

    @transaction.atomic
    def post(self, request, pk):
        days = int(request.data.get("days", 0))
        
        if days <= 0:
            return Response(
                {"detail": "Days must be positive"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        
        if booking.status != Booking.STATUS_CONFIRMED:
            return Response(
                {'detail': "Can't extend a non-active booking"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        prev_end_date = booking.end_date
        booking.end_date += timedelta(days=days)
        booking.save()
        
        print(f"📅 EXTEND - Booking {booking.id} extended by {days} days (from {prev_end_date} to {booking.end_date})")
        
        BookingHistory.objects.create(
            booking=booking,
            previous_status=booking.status,
            new_status=booking.status,
            changed_by=request.user,
            note=f'Extended by {days} days (from {prev_end_date} to {booking.end_date})'
        )
        
        try:
            notify_booking_extension(booking, days)
        except Exception as e:
            print(f"❌ Notification error: {e}")

        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingAssignLogisticsView(generics.GenericAPIView):
    """
    POST /api/bookings/<pk>/assign_logistics/
    Assign logistics provider
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_related('item', 'renter', 'owner'), 
            pk=pk
        )
        provider = request.data.get('provider')
        details = request.data.get('details', '')
        booking.owner_note = (booking.owner_note or '') + f"\nLogistics assigned: {provider} - {details}"
        booking.save()
        
        print(f"🚚 LOGISTICS - Booking {booking.id} assigned to {provider}")
        
        try:
            notify_third_party(booking, provider=provider, details=details)
        except Exception as e:
            print(f"❌ Notification error: {e}")
            
        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)