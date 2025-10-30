# Update your Booking model (models.py) with these changes:

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from Items.models import Item

User = get_user_model()


class Booking(models.Model):
    # Status constants
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED_BY_OWNER = "accepted_by_owner"
    STATUS_CONFIRMED = "confirmed"
    STATUS_CANCELLED = "cancelled"
    STATUS_COMPLETED = "completed"  # NEW STATUS
    
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED_BY_OWNER, "Accepted by Owner"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_COMPLETED, "Completed"),  # Add this
    ]
    
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_bookings')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_bookings')
    
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    third_party_required = models.BooleanField(default=False)
    
    renter_note = models.TextField(blank=True, default='')
    owner_note = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        renter_name = getattr(self.renter, "user_name", None) or getattr(self.renter, "email", "Unknown User")
        return f"Booking #{self.id} - {self.item.name} by {renter_name}"
    
    def save(self, *args, **kwargs):
        """Calculate total price on save"""
        if self.start_date and self.end_date and self.item:
            days = (self.end_date - self.start_date).days + 1
            self.total_price = days * self.item.price_per_day
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if booking has passed its end date"""
        return timezone.now().date() > self.end_date and self.status == self.STATUS_CONFIRMED
    
    def is_active(self):
        """Check if booking is currently active"""
        return self.status in [self.STATUS_CONFIRMED, self.STATUS_ACCEPTED_BY_OWNER]


class BookingHistory(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='history')
    previous_status = models.CharField(max_length=30)
    new_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, default='')
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Booking Histories"
    
    def __str__(self):
        return f"History #{self.id} - Booking #{self.booking.id}: {self.previous_status} → {self.new_status}"