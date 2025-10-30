from .email_templates import (
    notify_admin_booking_requested,
    notify_owner_booking_requested,
    notify_renter_booking_created,
    notify_renter_owner_accepted,
    notify_owner_renter_confirmed,
    notify_booking_cancelled,
    notify_booking_completed,
    notify_booking_extended,
    notify_third_party,
    send_rental_reminder,
    send_return_reminder,
    send_overdue_notification,
)


def notify_admin_booking_requested_wrapper(booking):
    """Send email to admin when new booking is created."""
    try:
        notify_admin_booking_requested(booking)
    except Exception as e:
        print(f"❌ Failed to notify admin: {e}")


def notify_owner_booking_requested_wrapper(booking):
    """Send email to owner when someone requests to rent their item."""
    try:
        notify_owner_booking_requested(booking)
        # Also send confirmation to renter
        notify_renter_booking_created(booking)
    except Exception as e:
        print(f"❌ Failed to notify owner: {e}")


def notify_renter_status(booking, actor='system', action='updated'):
    """Send email to renter based on booking status changes."""
    try:
        if action == 'accepted' and actor == 'owner':
            notify_renter_owner_accepted(booking)

        elif action == 'confirmed' and actor == 'renter':
            notify_owner_renter_confirmed(booking)

        elif action == 'cancelled':
            cancelled_by = 'owner' if actor == 'owner' or booking.owner == actor else 'renter'
            reason = ""
            if hasattr(booking, 'history') and booking.history.exists():
                latest = booking.history.first()
                reason = latest.note if latest else ""
            notify_booking_cancelled(booking, cancelled_by, reason)

        elif action == 'completed':
            notify_booking_completed(booking)

    except Exception as e:
        print(f"❌ Failed to notify renter: {e}")


def notify_third_party_wrapper(booking, provider=None, details=None):
    """Notify third-party logistics provider."""
    try:
        notify_third_party(booking, provider, details)
    except Exception as e:
        print(f"❌ Failed to notify third party: {e}")


def notify_booking_extension(booking, days_extended):
    """Send email when booking is extended."""
    try:
        notify_booking_extended(booking, days_extended)
    except Exception as e:
        print(f"❌ Failed to send extension notification: {e}")


def send_upcoming_rental_reminder(booking, days_until=1):
    """Send reminder before rental starts."""
    try:
        send_rental_reminder(booking, days_until)
    except Exception as e:
        print(f"❌ Failed to send rental reminder: {e}")


def send_upcoming_return_reminder(booking, days_until=1):
    """Send reminder before rental ends."""
    try:
        send_return_reminder(booking, days_until)
    except Exception as e:
        print(f"❌ Failed to send return reminder: {e}")


def send_rental_overdue_alert(booking):
    """Send alert when rental is overdue."""
    try:
        send_overdue_notification(booking)
    except Exception as e:
        print(f"❌ Failed to send overdue alert: {e}")