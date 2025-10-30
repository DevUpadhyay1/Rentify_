from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import models
from .models import Bill, PaymentTransaction, Refund
from Rental.models import Booking

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_name", "email"]


class PaymentTransactionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'transaction_id', 'bill', 'payment_method', 'payment_method_display',
            'amount', 'status', 'status_display', 'gateway_transaction_id', 
            'gateway_response', 'created_at'
        ]
        read_only_fields = ['transaction_id', 'created_at']


class RefundSerializer(serializers.ModelSerializer):
    requested_by = UserMiniSerializer(read_only=True)
    bill_number = serializers.CharField(source='bill.bill_number', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'bill', 'bill_number', 'requested_by', 'amount', 
            'reason', 'status', 'status_display', 'requested_at', 'processed_at'
        ]
        read_only_fields = ['requested_by', 'requested_at', 'processed_at', 'status_display']


class BillCreateSerializer(serializers.ModelSerializer):
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(),
        source='booking',
        write_only=True
    )
    
    class Meta:
        model = Bill
        fields = ['id', 'booking_id', 'subtotal', 'discount']
        read_only_fields = ['id']
    
    def _init_(self, *args, **kwargs):  # ✅ Fixed: Added double underscores
        super()._init_(*args, **kwargs)  # ✅ Fixed: Added double underscores
        request = self.context.get('request')
        if request and request.user:
            # ✅ Fixed: Booking has renter and owner, not user
            self.fields['booking_id'].queryset = Booking.objects.filter(
                models.Q(renter=request.user) | models.Q(owner=request.user)
            )
    
    def validate(self, data):
        booking = data.get('booking')
        
        # Check if booking already has a bill
        if hasattr(booking, 'bill'):
            raise serializers.ValidationError("This booking already has a bill.")
        
        # Check if booking is in correct status
        if booking.status not in ['accepted_by_owner', 'confirmed']:
            raise serializers.ValidationError("Booking must be accepted or confirmed to create bill.")
        
        return data


class BillSerializer(serializers.ModelSerializer):
    # ✅ Get user from booking relationship
    user = serializers.SerializerMethodField()
    transactions = PaymentTransactionSerializer(many=True, read_only=True)
    refunds = RefundSerializer(many=True, read_only=True)
    
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)
    
    class Meta:
        model = Bill
        fields = [
            'id', 'bill_number', 'booking', 'booking_id', 'user', 
            'subtotal', 'tax', 'service_fee', 'discount', 'total_amount',
            'payment_method', 'payment_method_display', 
            'payment_status', 'payment_status_display',
            'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'updated_at', 'paid_at',
            'transactions', 'refunds'
        ]
        read_only_fields = [
            'bill_number', 'user', 'total_amount', 'tax', 'service_fee',
            'created_at', 'updated_at', 'paid_at', 'transactions', 'refunds'
        ]
    
    def get_user(self, obj):
        if obj.booking and obj.booking.renter:
            return UserMiniSerializer(obj.booking.renter).data
        return None


class BillListSerializer(serializers.ModelSerializer):
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    # ✅ Get email from booking.renter
    user_email = serializers.EmailField(source='booking.renter.email', read_only=True)
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)
    
    class Meta:
        model = Bill
        fields = [
            'id', 'bill_number', 'booking_id', 'user_email', 
            'total_amount', 'payment_method', 'payment_method_display',
            'payment_status', 'payment_status_display', 'created_at'
        ]


class PaymentInitiateSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Bill.PAYMENT_METHOD_CHOICES)
    

class PaymentVerifySerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255)


class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = ['bill', 'amount', 'reason']
    
    def validate(self, data):
        bill = data.get('bill')
        
        # Check if bill is paid
        if bill.payment_status != Bill.STATUS_PAID:
            raise serializers.ValidationError("Bill must be paid to request refund.")
        
        # Check refund amount
        amount = data.get('amount')
        if amount > bill.total_amount:
            raise serializers.ValidationError(f"Refund amount cannot exceed ₹{bill.total_amount:.2f}")
        
        return data