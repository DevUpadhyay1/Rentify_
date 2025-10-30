# Bookings/tasks.py

from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .models import Booking, BookingHistory


@shared_task
def complete_expired_bookings():
    """
    Celery task to automatically complete expired bookings
    Run this task daily via Celery Beat
    """
    today = timezone.now().date()
    
    expired_bookings = Booking.objects.filter(
        end_date__lt=today,
        status=Booking.STATUS_CONFIRMED
    ).select_related('item', 'renter', 'owner')
    
    count = 0
    errors = []
    
    for booking in expired_bookings:
        try:
            with transaction.atomic():
                prev_status = booking.status
                
                # Mark as completed
                booking.status = Booking.STATUS_COMPLETED
                booking.save()
                
                # Make item available
                booking.item.availability_status = "available"
                booking.item.is_available = True
                booking.item.save(update_fields=["availability_status", "is_available"])
                
                # Create history
                BookingHistory.objects.create(
                    booking=booking,
                    previous_status=prev_status,
                    new_status=booking.status,
                    changed_by=None,
                    note='Automatically completed - rental period ended'
                )
                
                count += 1
                
        except Exception as e:
            errors.append(f"Booking #{booking.id}: {str(e)}")
    
    return {
        'completed': count,
        'errors': errors,
        'message': f'Completed {count} expired bookings'
    }


@shared_task
def check_upcoming_returns():
    """
    Check for bookings ending soon and send notifications
    """
    from datetime import timedelta
    
    tomorrow = timezone.now().date() + timedelta(days=1)
    
    upcoming_returns = Booking.objects.filter(
        end_date=tomorrow,
        status=Booking.STATUS_CONFIRMED
    ).select_related('item', 'renter', 'owner')
    
    # Send notifications to renters and owners
    for booking in upcoming_returns:
        # Add your notification logic here
        pass
    
    return f'Processed {upcoming_returns.count()} upcoming returns'


# ============================================
# Celery Beat Schedule Configuration
# ============================================
# Add this to your celery.py or settings.py:

"""
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'complete-expired-bookings-daily': {
        'task': 'Bookings.tasks.complete_expired_bookings',
        'schedule': crontab(hour=0, minute=5),  # Run at 00:05 daily
    },
    'check-upcoming-returns': {
        'task': 'Bookings.tasks.check_upcoming_returns',
        'schedule': crontab(hour=9, minute=0),  # Run at 09:00 daily
    },
}
"""