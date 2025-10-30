from django.core.management.base import BaseCommand
from Items.models import Item

class Command(BaseCommand):
    help = 'Reset all items to AVAILABLE status'

    def add_arguments(self, parser):
        parser.add_argument(
            '--item-ids',
            nargs='+',
            type=int,
            help='Specific item IDs to update (optional)'
        )

    def handle(self, *args, **options):
        item_ids = options.get('item_ids')
        
        if item_ids:
            items = Item.objects.filter(id__in=item_ids)
            self.stdout.write(f'Updating {len(item_ids)} specific items...')
        else:
            items = Item.objects.all()
            self.stdout.write(f'Updating ALL {items.count()} items...')
        
        updated = items.update(availability_status='AVAILABLE')
        
        self.stdout.write(
            self.style.SUCCESS(f'✅ Successfully updated {updated} items to AVAILABLE')
        )
        
        # Show status
        for item in items:
            status_emoji = '✅' if item.is_available else '❌'
            self.stdout.write(
                f'{status_emoji} Item #{item.id} - {item.name}: '
                f'status={item.availability_status}, is_available={item.is_available}'
            )