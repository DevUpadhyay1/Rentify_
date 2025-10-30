from django.contrib import admin
from .models import ItemReview, OwnerReview, RenterReview, ReviewHelpful, ReviewResponse


@admin.register(ItemReview)
class ItemReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'item', 'reviewer', 'overall_rating', 'would_recommend', 'helpful_count', 'created_at']
    list_filter = ['overall_rating', 'would_recommend', 'created_at']
    search_fields = ['item_name', 'reviewer_user_name', 'title', 'comment']
    readonly_fields = ['created_at', 'updated_at', 'helpful_count']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('item', 'booking', 'reviewer')
        }),
        ('Ratings', {
            'fields': ('overall_rating', 'condition_rating', 'accuracy_rating', 'value_rating')
        }),
        ('Review Content', {
            'fields': ('title', 'comment', 'pros', 'cons', 'would_recommend')
        }),
        ('Metadata', {
            'fields': ('helpful_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OwnerReview)
class OwnerReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'owner', 'reviewer', 'overall_rating', 'would_rent_again', 'helpful_count', 'created_at']
    list_filter = ['overall_rating', 'would_rent_again', 'created_at']
    search_fields = ['owner_user_name', 'reviewer_user_name', 'title', 'comment']
    readonly_fields = ['created_at', 'updated_at', 'helpful_count']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('owner', 'booking', 'reviewer')
        }),
        ('Ratings', {
            'fields': ('overall_rating', 'communication_rating', 'responsiveness_rating', 'friendliness_rating')
        }),
        ('Review Content', {
            'fields': ('title', 'comment', 'would_rent_again')
        }),
        ('Metadata', {
            'fields': ('helpful_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RenterReview)
class RenterReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'renter', 'reviewer', 'overall_rating', 'returned_clean', 'returned_on_time', 'any_damage', 'created_at']
    list_filter = ['overall_rating', 'returned_clean', 'returned_on_time', 'any_damage', 'would_rent_to_again', 'created_at']
    search_fields = ['renter_user_name', 'reviewer_user_name', 'title', 'comment']
    readonly_fields = ['created_at', 'updated_at', 'helpful_count']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('renter', 'booking', 'reviewer')
        }),
        ('Ratings', {
            'fields': ('overall_rating', 'item_care_rating', 'communication_rating', 
                      'return_condition_rating', 'punctuality_rating')
        }),
        ('Review Content', {
            'fields': ('title', 'comment', 'would_rent_to_again')
        }),
        ('Return Details', {
            'fields': ('returned_clean', 'returned_on_time', 'any_damage', 'damage_description')
        }),
        ('Metadata', {
            'fields': ('helpful_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'review_type', 'review_id', 'created_at']
    list_filter = ['review_type', 'created_at']
    search_fields = ['user__user_name']
    ordering = ['-created_at']


@admin.register(ReviewResponse)
class ReviewResponseAdmin(admin.ModelAdmin):
    list_display = ['id', 'review_type', 'review_id', 'responder', 'created_at']
    list_filter = ['review_type', 'created_at']
    search_fields = ['responder__user_name', 'response']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']