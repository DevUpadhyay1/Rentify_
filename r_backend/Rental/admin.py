from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import Booking, BookingHistory
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'item_link',
        'renter_link',
        'owner_link',
        'status_badge',
        'rental_period',
        'total_price_display',
        'third_party_required',
        'active_status',
        'created_at',
    ]
    list_filter = [
        'status',
        'third_party_required',
        'created_at',
        'start_date',
        'end_date',
    ]
    search_fields = [
        'item__name',
        'renter__user_name',
        'renter__email',
        'owner__user_name',
        'owner__email',
        'renter_note',
        'owner_note',
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'total_price',
        'booking_history_display',
    ]
    fieldsets = (
        ('Booking Information', {
            'fields': ('item', 'renter', 'owner', 'status')
        }),
        ('Rental Period', {
            'fields': ('start_date', 'end_date', 'total_price')
        }),
        ('Notes & Requirements', {
            'fields': ('renter_note', 'owner_note', 'third_party_required')
        }),
        ('Logistics', {
            'fields': ('logistics_provider', 'logistics_details'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('History', {
            'fields': ('booking_history_display',),
            'classes': ('collapse',)
        }),
    )
    list_per_page = 25
    date_hierarchy = 'created_at'
    actions = ['mark_as_confirmed', 'mark_as_cancelled', 'mark_as_completed']

    # ---------- Link Fields ----------
    def item_link(self, obj):
        if obj.item:
            url = reverse('admin:Items_item_change', args=[obj.item.id])
            return format_html('<a href="{}">{}</a>', url, obj.item.name)
        return '-'
    item_link.short_description = 'Item'

    def renter_link(self, obj):
        if obj.renter:
            url = reverse('admin:%s_%s_change' % (User._meta.app_label, User._meta.model_name), args=[obj.renter.id])
            display_name = obj.renter.user_name or obj.renter.email
            return format_html('<a href="{}">{}</a>', url, display_name)
        return '-'
    renter_link.short_description = 'Renter'

    def owner_link(self, obj):
        if obj.owner:
            url = reverse('admin:%s_%s_change' % (User._meta.app_label, User._meta.model_name), args=[obj.owner.id])
            display_name = obj.owner.user_name or obj.owner.email
            return format_html('<a href="{}">{}</a>', url, display_name)
        return '-'
    owner_link.short_description = 'Owner'

    # ---------- Custom Display Fields ----------
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'accepted_by_owner': '#1E90FF',
            'accepted_by_renter': '#9370DB',
            'confirmed': '#32CD32',
            'cancelled': '#DC143C',
            'completed': '#808080',
        }
        color = colors.get(obj.status, '#000')
        return format_html(
            '<span style="background-color:{};color:white;padding:5px 10px;'
            'border-radius:12px;font-weight:bold;font-size:11px;">{}</span>',
            color,
            obj.status.replace('_', ' ').title()
        )
    status_badge.short_description = 'Status'

    def rental_period(self, obj):
        if obj.start_date and obj.end_date:
            duration = (obj.end_date - obj.start_date).days
            return format_html(
                '{} <br><small>to</small><br> {} <br>'
                '<small style="color:#888;">({} days)</small>',
                obj.start_date.strftime('%d %b %Y'),
                obj.end_date.strftime('%d %b %Y'),
                duration
            )
        return '-'
    rental_period.short_description = 'Rental Period'

    def total_price_display(self, obj):
        if obj.total_price:
            return format_html('<strong style="color:#28a745;">₹{}</strong>', f'{obj.total_price:,.2f}')
        return format_html('<span style="color:#999;">Not calculated</span>')
    total_price_display.short_description = 'Total Price'

    def active_status(self, obj):
        today = timezone.now().date()
        if obj.status == 'confirmed' and obj.start_date <= today <= obj.end_date:
            return format_html('<span style="color:green;">✓ Active</span>')
        elif obj.status == 'cancelled':
            return format_html('<span style="color:red;">✗ Cancelled</span>')
        elif obj.end_date < today:
            return format_html('<span style="color:gray;">Completed</span>')
        return format_html('<span style="color:orange;">Upcoming</span>')
    active_status.short_description = 'Active Status'

    # ---------- Booking History ----------
    def booking_history_display(self, obj):
        histories = BookingHistory.objects.filter(booking=obj).order_by('-timestamp')
        if histories.exists():
            html = ['<table style="width:100%;border-collapse:collapse;">']
            html.append(
                '<tr style="background-color:#f5f5f5;font-weight:bold;">'
                '<th style="padding:8px;border:1px solid #ddd;">Timestamp</th>'
                '<th style="padding:8px;border:1px solid #ddd;">From</th>'
                '<th style="padding:8px;border:1px solid #ddd;">To</th>'
                '<th style="padding:8px;border:1px solid #ddd;">Changed By</th>'
                '<th style="padding:8px;border:1px solid #ddd;">Note</th></tr>'
            )
            for h in histories:
                html.append(
                    f"<tr><td style='padding:8px;border:1px solid #ddd;'>{h.timestamp.strftime('%Y-%m-%d %H:%M')}</td>"
                    f"<td style='padding:8px;border:1px solid #ddd;'>{h.previous_status or '-'}</td>"
                    f"<td style='padding:8px;border:1px solid #ddd;'>{h.new_status}</td>"
                    f"<td style='padding:8px;border:1px solid #ddd;'>{h.changed_by or 'System'}</td>"
                    f"<td style='padding:8px;border:1px solid #ddd;'>{h.note or '-'}</td></tr>"
                )
            html.append('</table>')
            return format_html(''.join(html))
        return format_html('<p style="color:#999;">No history available</p>')
    booking_history_display.short_description = 'Booking History'

    # ---------- Admin Actions ----------
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} booking(s) marked as confirmed.')
    mark_as_confirmed.short_description = 'Mark selected bookings as Confirmed'

    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} booking(s) marked as cancelled.')
    mark_as_cancelled.short_description = 'Mark selected bookings as Cancelled'

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} booking(s) marked as completed.')
    mark_as_completed.short_description = 'Mark selected bookings as Completed'


@admin.register(BookingHistory)
class BookingHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'booking_link',
        'status_change',
        'changed_by_link',
        'timestamp',
        'note_preview',
    ]
    list_filter = ['new_status', 'previous_status', 'timestamp']
    search_fields = ['booking__id', 'booking__item__name', 'changed_by', 'note']
    readonly_fields = ['booking', 'previous_status', 'new_status', 'changed_by', 'timestamp', 'note']
    date_hierarchy = 'timestamp'
    list_per_page = 50

    def booking_link(self, obj):
        if obj.booking:
            url = reverse('admin:Rental_booking_change', args=[obj.booking.id])
            return format_html('<a href="{}">Booking #{} - {}</a>', url, obj.booking.id, obj.booking.item)
        return '-'
    booking_link.short_description = 'Booking'

    def status_change(self, obj):
        return format_html(
            '<span style="color:#666;">{}</span> → <span style="color:#28a745;font-weight:bold;">{}</span>',
            obj.previous_status or 'Initial',
            obj.new_status,
        )
    status_change.short_description = 'Status Change'

    def changed_by_link(self, obj):
        if obj.changed_by:
            user = User.objects.filter(email=obj.changed_by).first() or \
                   User.objects.filter(user_name=obj.changed_by).first()
            if user:
                url = reverse('admin:%s_%s_change' % (User._meta.app_label, User._meta.model_name), args=[user.id])
                return format_html('<a href="{}">{}</a>', url, user.user_name or user.email)
            return obj.changed_by
        return format_html('<span style="color:#999;">System</span>')
    changed_by_link.short_description = 'Changed By'

    def note_preview(self, obj):
        if obj.note:
            return obj.note if len(obj.note) <= 50 else obj.note[:50] + '...'
        return format_html('<span style="color:#999;">-</span>')
    note_preview.short_description = 'Note'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
