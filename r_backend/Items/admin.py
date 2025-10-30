from django.contrib import admin
from .models import Category, SubCategory, Item, ItemImage, Wishlist


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_approved', 'created_at']
    search_fields = ['name']
    list_filter = ['is_approved', 'created_at']
    ordering = ['-created_at']


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    search_fields = ['tname', 'category__name']
    list_filter = ['category']
    ordering = ['name']


class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'owner', 'category', 'subcategory', 'price_per_day', 'condition',
        'availability_status', 'location', 'deposit_required',
        'minimum_rental_days', 'maximum_rental_days', 'rating', 'total_ratings','is_available',
        'created_at', 'updated_at'
    ]
    search_fields = ['name', 'owner__username', 'category__name', 'subcategory__name']
    list_filter = ['category', 'subcategory', 'condition', 'availability_status', 'created_at']
    ordering = ['-created_at']
    inlines = [ItemImageInline]


@admin.register(ItemImage)
class ItemImageAdmin(admin.ModelAdmin):
    list_display = ['item', 'image_url', 'is_primary', 'uploaded_at']
    list_filter = ['is_primary', 'uploaded_at']
    ordering = ['-uploaded_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'item']
    search_fields = ['user__username', 'item__name']
    ordering = ['user']
