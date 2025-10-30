from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Booking, BookingHistory
from Items.models import Item

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_name", "email", "phone", "profile_image"]  # ✅ Fixed: use 'user_name'

# Minimal Item serializer for nested display
class ItemInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'price_per_day', 'location', 'condition', 'is_available']

# Booking history serializer
class BookingHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.user_name', read_only=True)  # ✅ Fixed

    class Meta:
        model = BookingHistory
        fields = ['id', 'previous_status', 'new_status', 'changed_by', 'changed_by_name', 'timestamp', 'note']

# Booking create serializer (writable)
class BookingCreateSerializer(serializers.ModelSerializer):
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), source='item', write_only=True
    )

    class Meta:
        model = Booking
        fields = ['id', 'item_id', 'start_date', 'end_date', 'renter_note', 'third_party_required']
        read_only_fields = ['id']

    def validate(self, data):
        start = data.get('start_date')
        end = data.get('end_date')
        item = data.get('item')
        request = self.context.get('request')
        
        if start and end and start > end:
            raise serializers.ValidationError("start_date must be before end_date")
        
        # Check if owner trying to book own item
        if item and request and item.owner == request.user:
            raise serializers.ValidationError("You cannot book your own item.")
        
        # ✅ REMOVED: is_available check - we'll check for actual conflicts instead
        
        # ✅ Check for overlapping bookings (ANY active status)
        from django.db.models import Q
        overlapping = Booking.objects.filter(
            item=item,
            start_date__lt=end,
            end_date__gt=start
        ).exclude(
            status__in=['cancelled', 'completed']
        )
        
        if overlapping.exists():
            raise serializers.ValidationError(
                "This item is already booked for the selected dates. "
                "Please choose different dates."
            )
        
        return data
# Booking serializer (read-only for nested display)
class BookingSerializer(serializers.ModelSerializer):
    item = ItemInlineSerializer(read_only=True)
    renter = UserMiniSerializer(read_only=True)
    owner = UserMiniSerializer(read_only=True)
    history = BookingHistorySerializer(many=True, read_only=True)
    bill = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'item', 'renter', 'owner', 'start_date', 'end_date',
            'status', 'total_price', 'third_party_required',
            'renter_note', 'owner_note',
            'created_at', 'bill', 'updated_at', 'history'
        ]
    
    def get_bill(self, obj):
        """Return bill details if exists"""
        try:
            from billing.models import Bill
            bill = Bill.objects.filter(booking=obj).first()
            if bill:
                return {
                    'id': bill.id,
                    'bill_number': bill.bill_number,
                    'total_amount': str(bill.total_amount),
                    'payment_status': bill.payment_status,
                    'payment_status_display': bill.get_payment_status_display(),
                    'payment_method_display': bill.get_payment_method_display() if bill.payment_method else None,
                    'paid_at': bill.paid_at,
                }
            return None
        except Exception as e:
            print(f"Error fetching bill for booking {obj.id}: {e}")
            return None