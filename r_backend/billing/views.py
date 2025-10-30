from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Bill, PaymentTransaction, Refund
from .serializers import (
    BillSerializer, BillListSerializer, BillCreateSerializer,
    PaymentTransactionSerializer, RefundSerializer, RefundRequestSerializer,
    PaymentInitiateSerializer, PaymentVerifySerializer
)
from .permissions import IsBillOwnerOrAdmin, IsRefundOwnerOrAdmin
from .utils import (
    initiate_razorpay_payment, 
    verify_razorpay_signature, 
    send_bill_email,
    send_payment_confirmation_email
)


class BillListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/billing/bills/    -> list all bills of logged-in user
    POST /api/billing/bills/    -> create a new bill (manual creation)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BillCreateSerializer
        return BillListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # ✅ Fixed: Added booking_renter and booking_owner with double underscores
            qs = Bill.objects.all().select_related(
                'user', 
                'booking', 
                'booking__renter', 
                'booking__owner'
            )
        else:
            # ✅ Fixed: Filter by booking's renter or owner, not bill's user
            qs = Bill.objects.filter(
                models.Q(booking__renter=user) | models.Q(booking__owner=user)
            ).select_related(
                'user', 
                'booking', 
                'booking__renter', 
                'booking__owner'
            )
        
        # Filter by booking if provided
        booking_id = self.request.query_params.get('booking')
        if booking_id:
            qs = qs.filter(booking_id=booking_id)
        
        # Filter by payment status
        payment_status = self.request.query_params.get('status')
        if payment_status:
            qs = qs.filter(payment_status=payment_status)
        
        return qs

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']
        
        # Check if booking already has a bill
        if hasattr(booking, 'bill'):
            raise serializers.ValidationError("This booking already has a bill.")
        
        # Create bill
        bill = serializer.save(user=self.request.user)
        
        # Send email notification
        try:
            send_bill_email(bill)
        except Exception as e:
            print(f"Error sending bill email: {e}")
        
        return bill


class BillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/billing/bills/<pk>/  -> retrieve bill details
    PUT    /api/billing/bills/<pk>/  -> update bill
    DELETE /api/billing/bills/<pk>/  -> delete bill
    """
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsBillOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff:
            # ✅ Fixed: Use double underscores __ not single underscore _
            return Bill.objects.all().select_related(
                'user', 
                'booking', 
                'booking__renter',  # ✅ Fixed from booking_renter
                'booking__owner'    # ✅ Fixed from booking_owner
            ).prefetch_related('transactions', 'refunds')
        
        # ✅ Fixed: Allow access if user is the renter (who pays) OR the owner (who receives payment)
        return Bill.objects.filter(
            models.Q(booking__renter=user) | models.Q(booking__owner=user)  # ✅ Fixed
        ).select_related(
            'user', 
            'booking', 
            'booking__renter',  # ✅ Fixed from booking_renter
            'booking__owner'    # ✅ Fixed from booking_owner
        ).prefetch_related('transactions', 'refunds')
    
    

class BillInitiatePaymentView(APIView):
    """
    POST /api/billing/bills/<pk>/initiate_payment/
    Initiate payment for a bill (Razorpay or COD)
    """
    permission_classes = [permissions.IsAuthenticated, IsBillOwnerOrAdmin]

    @transaction.atomic
    def post(self, request, pk):
        # ✅ Use get_queryset to respect permissions
        bill = get_object_or_404(
            Bill.objects.filter(
                models.Q(booking__renter=request.user) | models.Q(booking__owner=request.user)
            ),
            pk=pk
        )
        
        # Check if already paid
        if bill.payment_status == Bill.STATUS_PAID:
            return Response(
                {"detail": "Bill is already paid."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = PaymentInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment_method = serializer.validated_data['payment_method']
        
        # Create transaction record
        transaction_obj = PaymentTransaction.objects.create(
            bill=bill,
            payment_method=payment_method,
            amount=bill.total_amount,
            status=PaymentTransaction.STATUS_PENDING
        )
        
        try:
            if payment_method == Bill.PAYMENT_RAZORPAY:
                # Initiate Razorpay payment
                order_data = initiate_razorpay_payment(bill)
                transaction_obj.gateway_transaction_id = order_data['razorpay_order_id']
                transaction_obj.save()
                
                return Response({
                    "success": True,
                    "transaction_id": transaction_obj.transaction_id,
                    "payment_data": order_data
                }, status=status.HTTP_200_OK)
            
            elif payment_method == Bill.PAYMENT_COD:
                # COD - no gateway needed
                bill.payment_method = Bill.PAYMENT_COD
                bill.save()
                
                return Response({
                    "success": True,
                    "message": "COD selected. Pay when you receive the item.",
                    "transaction_id": transaction_obj.transaction_id
                }, status=status.HTTP_200_OK)
            
            else:
                transaction_obj.status = PaymentTransaction.STATUS_FAILED
                transaction_obj.save()
                return Response(
                    {"detail": "Invalid payment method"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            transaction_obj.status = PaymentTransaction.STATUS_FAILED
            transaction_obj.save()
            return Response(
                {"detail": f"Payment initiation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BillVerifyPaymentView(APIView):
    """
    POST /api/billing/bills/<pk>/verify_payment/
    Verify Razorpay payment signature
    """
    permission_classes = [permissions.IsAuthenticated, IsBillOwnerOrAdmin]

    @transaction.atomic
    def post(self, request, pk):
        # ✅ Use get_queryset to respect permissions
        bill = get_object_or_404(
            Bill.objects.filter(
                models.Q(booking__renter=request.user) | models.Q(booking__owner=request.user)
            ),
            pk=pk
        )
        
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']
        
        # Verify signature
        is_valid = verify_razorpay_signature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )
        
        if is_valid:
            # Update bill
            bill.razorpay_order_id = razorpay_order_id
            bill.razorpay_payment_id = razorpay_payment_id
            bill.razorpay_signature = razorpay_signature
            bill.mark_as_paid()
            
            # Update transaction
            transaction_obj = bill.transactions.filter(
                gateway_transaction_id=razorpay_order_id
            ).first()
            
            if transaction_obj:
                transaction_obj.gateway_transaction_id = razorpay_payment_id
                transaction_obj.status = PaymentTransaction.STATUS_SUCCESS
                transaction_obj.save()
            
            # Send confirmation email
            try:
                send_payment_confirmation_email(bill)
            except Exception as e:
                print(f"Error sending confirmation email: {e}")
            
            return Response({
                "success": True,
                "message": "Payment verified successfully",
                "bill": BillSerializer(bill).data
            }, status=status.HTTP_200_OK)
        else:
            bill.payment_status = Bill.STATUS_FAILED
            bill.save()
            
            return Response(
                {"detail": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )


class BillConfirmCODView(APIView):
    """
    POST /api/billing/bills/<pk>/confirm_cod/
    Confirm COD payment (Owner only)
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        # ✅ Use get_queryset to respect permissions
        bill = get_object_or_404(
            Bill.objects.filter(
                models.Q(booking__renter=request.user) | models.Q(booking__owner=request.user)
            ),
            pk=pk
        )
        
        # Check if user is booking owner (item owner)
        if bill.booking.owner != request.user and not request.user.is_staff:
            return Response(
                {"detail": "Only the item owner can confirm COD payment."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if bill.payment_method != Bill.PAYMENT_COD:
            return Response(
                {"detail": "This bill is not COD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if bill.payment_status == Bill.STATUS_PAID:
            return Response(
                {"detail": "Bill is already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark as paid
        bill.mark_as_paid()
        
        # Update transaction
        transaction_obj = bill.transactions.filter(
            payment_method=Bill.PAYMENT_COD
        ).first()
        
        if transaction_obj:
            transaction_obj.status = PaymentTransaction.STATUS_SUCCESS
            transaction_obj.save()
        
        # Send confirmation email
        try:
            send_payment_confirmation_email(bill)
        except Exception as e:
            print(f"Error sending confirmation email: {e}")
        
        return Response({
            "success": True,
            "message": "COD payment confirmed",
            "bill": BillSerializer(bill).data
        }, status=status.HTTP_200_OK)


class PaymentTransactionListView(generics.ListAPIView):
    """
    GET /api/billing/transactions/  -> list all transactions
    """
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PaymentTransaction.objects.all().select_related('bill', 'bill__user')
        else:
            # ✅ Fixed: Filter by booking renter or owner
            return PaymentTransaction.objects.filter(
                models.Q(bill_bookingrenter=user) | models.Q(billbooking_owner=user)
            ).select_related('bill', 'bill__user')


class PaymentTransactionRetrieveView(generics.RetrieveAPIView):
    """
    GET /api/billing/transactions/<pk>/  -> retrieve transaction details
    """
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PaymentTransaction.objects.all().select_related('bill', 'bill__user')
        else:
            return PaymentTransaction.objects.filter(
                models.Q(bill_bookingrenter=user) | models.Q(billbooking_owner=user)
            ).select_related('bill', 'bill__user')


class RefundListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/billing/refunds/    -> list all refunds
    POST /api/billing/refunds/    -> request a refund
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RefundRequestSerializer
        return RefundSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Refund.objects.all().select_related('bill', 'requested_by')
        else:
            return Refund.objects.filter(
                requested_by=user
            ).select_related('bill', 'requested_by')

    def perform_create(self, serializer):
        refund = serializer.save(requested_by=self.request.user)
        
        # Send notification to admin
        # notify_admin_refund_requested(refund)
        
        return refund


class RefundRetrieveView(generics.RetrieveAPIView):
    """
    GET /api/billing/refunds/<pk>/  -> retrieve refund details
    """
    queryset = Refund.objects.all().select_related('bill', 'requested_by')
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated, IsRefundOwnerOrAdmin]


class RefundApproveView(APIView):
    """
    POST /api/billing/refunds/<pk>/approve/
    Approve refund request (Admin only)
    """
    permission_classes = [permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        refund = get_object_or_404(Refund, pk=pk)
        
        if refund.status != Refund.STATUS_REQUESTED:
            return Response(
                {"detail": "Refund is not in requested state."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Approve refund
        refund.status = Refund.STATUS_APPROVED
        refund.processed_at = timezone.now()
        refund.save()
        
        # Update bill
        bill = refund.bill
        bill.payment_status = Bill.STATUS_REFUNDED
        bill.save()
        
        # Send notification
        # notify_refund_status(refund, 'approved')
        
        return Response(
            RefundSerializer(refund).data,
            status=status.HTTP_200_OK
        )


class RefundRejectView(APIView):
    """
    POST /api/billing/refunds/<pk>/reject/
    Reject refund request (Admin only)
    """
    permission_classes = [permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        refund = get_object_or_404(Refund, pk=pk)
        
        if refund.status != Refund.STATUS_REQUESTED:
            return Response(
                {"detail": "Refund is not in requested state."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reject refund
        refund.status = Refund.STATUS_REJECTED
        refund.processed_at = timezone.now()
        refund.save()
        
        # Send notification
        # notify_refund_status(refund, 'rejected')
        
        return Response(
            RefundSerializer(refund).data,
            status=status.HTTP_200_OK
        )