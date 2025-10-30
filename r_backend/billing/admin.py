from django.contrib import admin
from .models import Bill, PaymentTransaction, Refund


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('bill_number', 'user', 'total_amount', 'payment_status', 'created_at')
    search_fields = ('bill_number', 'user__email')
    list_filter = ('payment_status', 'payment_method', 'created_at')
    readonly_fields = ('bill_number', 'created_at', 'updated_at', 'paid_at')


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'bill', 'payment_method', 'amount', 'status', 'created_at')
    search_fields = ('transaction_id', 'bill__bill_number')
    list_filter = ('payment_method', 'status', 'created_at')


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ('bill', 'requested_by', 'amount', 'status', 'requested_at')
    search_fields = ('bill_bill_number', 'requested_by_email')
    list_filter = ('status', 'requested_at')