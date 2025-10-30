from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()


class Bill(models.Model):
    # Payment Methods
    PAYMENT_COD = 'cod'
    PAYMENT_RAZORPAY = 'razorpay'
    
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_COD, 'Cash on Delivery'),
        (PAYMENT_RAZORPAY, 'Razorpay'),
    ]
    
    # Payment Status
    STATUS_PENDING = 'pending'
    STATUS_PAID = 'paid'
    STATUS_FAILED = 'failed'
    STATUS_REFUNDED = 'refunded'
    
    PAYMENT_STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_PAID, 'Paid'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_REFUNDED, 'Refunded'),
    ]
    
    # Basic Fields
    bill_number = models.CharField(max_length=50, unique=True)
    booking = models.OneToOneField('Rental.Booking', on_delete=models.CASCADE, related_name='bill')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bills')
    
    # Financial Details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment Info
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=STATUS_PENDING)
    
    # Razorpay Fields
    razorpay_order_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def _str_(self):
        return f"Bill #{self.bill_number}"
    
    def save(self, *args, **kwargs):
        if not self.bill_number:
            self.bill_number = f"BILL-{timezone.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}"
        if not self.total_amount:
            self.calculate_total()
        super().save(*args, **kwargs)
    
    def calculate_total(self):
        """Calculate total amount"""
        from django.conf import settings
        
        # Calculate tax (18% GST)
        tax_rate = getattr(settings, 'BILLING_TAX_RATE', 0.18)
        self.tax = self.subtotal * Decimal(str(tax_rate))
        
        # Calculate service fee (5%)
        service_fee_rate = getattr(settings, 'BILLING_SERVICE_FEE_RATE', 0.05)
        self.service_fee = self.subtotal * Decimal(str(service_fee_rate))
        
        # Total
        self.total_amount = self.subtotal + self.tax + self.service_fee - self.discount
    
    def mark_as_paid(self):
        """Mark bill as paid"""
        self.payment_status = self.STATUS_PAID
        self.paid_at = timezone.now()
        self.save()
        
        # Update booking
        self.booking.status = 'confirmed'
        self.booking.save()


class PaymentTransaction(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_SUCCESS = 'success'
    STATUS_FAILED = 'failed'
    
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_SUCCESS, 'Success'),
        (STATUS_FAILED, 'Failed'),
    ]
    
    transaction_id = models.CharField(max_length=100, unique=True)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='transactions')
    payment_method = models.CharField(max_length=20, choices=Bill.PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    gateway_transaction_id = models.CharField(max_length=255, null=True, blank=True)
    gateway_response = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def _str_(self):
        return f"Transaction {self.transaction_id}"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"TXN-{timezone.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)


class Refund(models.Model):
    STATUS_REQUESTED = 'requested'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_COMPLETED = 'completed'
    
    STATUS_CHOICES = [
        (STATUS_REQUESTED, 'Requested'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_COMPLETED, 'Completed'),
    ]
    
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='refunds')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refund_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_REQUESTED)
    
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-requested_at']
    
    def _str_(self):
        return f"Refund for {self.bill.bill_number}"