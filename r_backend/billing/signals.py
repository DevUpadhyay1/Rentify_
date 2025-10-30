from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from django.conf import settings
from Rental.models import Booking
from .models import Bill


@receiver(post_save, sender=Booking)
def create_bill(sender, instance, created, **kwargs):
    if instance.status == 'accepted_by_owner' and not hasattr(instance, 'bill'):
        subtotal = Decimal(instance.total_price)

        # Convert tax and service rates to Decimal safely
        tax_rate = Decimal(str(getattr(settings, 'BILLING_TAX_RATE', 0.18)))
        service_rate = Decimal(str(getattr(settings, 'BILLING_SERVICE_FEE_RATE', 0.05)))

        tax = subtotal * tax_rate
        service_fee = subtotal * service_rate
        total = subtotal + tax + service_fee

        Bill.objects.create(
            booking=instance,
            user=instance.renter,  # ✅ changed from instance.user
            subtotal=subtotal,
            tax=tax,
            service_fee=service_fee,
            total_amount=total,
        )
