from django.db.models.signals import post_save
from django.dispatch import receiver
from Rental.models import Booking
from .models import Bill
from .utils import send_bill_email


@receiver(post_save, sender=Booking)
def create_bill(sender, instance, created, **kwargs):
    """Auto-create bill when owner accepts booking"""
    if instance.status == 'accepted_by_owner' and not hasattr(instance, 'bill'):
        bill = Bill.objects.create(
            booking=instance,
            user=instance.user,
            subtotal=instance.price
        )
        try:
            send_bill_email(bill)
        except:
            pass