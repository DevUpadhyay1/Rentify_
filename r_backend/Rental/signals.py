from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Booking, BookingHistory
from .utils import notify_owner_booking_requested, notify_renter_status

@receiver(pre_save, sender=Booking)
def create_booking_history(sender, instance, **kwargs):
    if instance.pk:
        old = Booking.objects.get(pk=instance.pk)
        if old.status != instance.status:
            BookingHistory.objects.create(
                booking=instance,
                previous_status=old.status,
                new_status=instance.status,
                changed_by=None  # if you want actor, set it in the views using explicit create
            )

@receiver(post_save, sender=Booking)
def post_booking_save(sender, instance, created, **kwargs):
    if created:
        notify_owner_booking_requested(instance)
        # notify admin too

@receiver(post_save, sender=Booking)
def check_booking_expiry(sender, instance, created, **kwargs):
    """Check if booking has expired after save"""
    if not created:
        instance.check_if_expired()