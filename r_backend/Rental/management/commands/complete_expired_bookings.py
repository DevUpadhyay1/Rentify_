# Save as: Bookings/management/commands/complete_expired_bookings.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from Rental.models import Booking, BookingHistory


class Command(BaseCommand):
    help = 'Automatically complete expired bookings and make items available'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        today = timezone.now().date()
        dry_run = options['dry_run']
        
        # Find all confirmed bookings that have passed their end date
        expired_bookings = Booking.objects.filter(
            end_date__lt=today,
            status=Booking.STATUS_CONFIRMED
        ).select_related('item', 'renter', 'owner')
        
        count = expired_bookings.count()
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'DRY RUN: Would complete {count} expired bookings')
            )
            for booking in expired_bookings:
                self.stdout.write(
                    f'  - Booking #{booking.id}: {booking.item.name} '
                    f'(ended {booking.end_date})'
                )
            return
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('No expired bookings found.')
            )
            return
        
        updated = 0
        for booking in expired_bookings:
            try:
                prev_status = booking.status
                
                # Mark booking as completed
                booking.status = 'completed'  # Make sure this status exists in your model
                booking.save()
                
                # Make item available again
                booking.item.availability_status = "available"
                booking.item.is_available = True
                booking.item.save(update_fields=["availability_status", "is_available"])
                
                # Create history entry
                BookingHistory.objects.create(
                    booking=booking,
                    previous_status=prev_status,
                    new_status=booking.status,
                    changed_by=None,  # System automated
                    note='Automatically completed - rental period ended'
                )
                
                updated += 1
                self.stdout.write(
                    f'Completed booking #{booking.id}: {booking.item.name}'
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error completing booking #{booking.id}: {str(e)}'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully completed {updated} out of {count} expired bookings'
            )
        )