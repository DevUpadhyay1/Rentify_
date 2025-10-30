from django.urls import path
from .views import (
    BillListCreateView,
    BillRetrieveUpdateDestroyView,
    BillInitiatePaymentView,
    BillVerifyPaymentView,
    BillConfirmCODView,
    PaymentTransactionListView,
    PaymentTransactionRetrieveView,
    RefundListCreateView,
    RefundRetrieveView,
    RefundApproveView,
    RefundRejectView,
)

app_name = 'billing'

urlpatterns = [
    # Bill endpoints
    path('bills/', BillListCreateView.as_view(), name='bill-list-create'),
    path('bills/<int:pk>/', BillRetrieveUpdateDestroyView.as_view(), name='bill-detail'),
    path('bills/<int:pk>/initiate_payment/', BillInitiatePaymentView.as_view(), name='bill-initiate-payment'),
    path('bills/<int:pk>/verify_payment/', BillVerifyPaymentView.as_view(), name='bill-verify-payment'),
    path('bills/<int:pk>/confirm_cod/', BillConfirmCODView.as_view(), name='bill-confirm-cod'),
    
    # Transaction endpoints
    path('transactions/', PaymentTransactionListView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', PaymentTransactionRetrieveView.as_view(), name='transaction-detail'),
    
    # Refund endpoints
    path('refunds/', RefundListCreateView.as_view(), name='refund-list-create'),
    path('refunds/<int:pk>/', RefundRetrieveView.as_view(), name='refund-detail'),
    path('refunds/<int:pk>/approve/', RefundApproveView.as_view(), name='refund-approve'),
    path('refunds/<int:pk>/reject/', RefundRejectView.as_view(), name='refund-reject'),
]