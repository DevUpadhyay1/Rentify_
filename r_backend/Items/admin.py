from django.contrib import admin
from .models import Category, Item, ItemImage, ItemReview, Wishlist


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description','icon','created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)


class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'owner', 'category', 'price_per_day', 'availability_status',
        'condition', 'location', 'rating', 'created_at'
    )
    list_filter = ('availability_status', 'condition', 'category', 'created_at')
    search_fields = ('title', 'description', 'location', 'owner__email')
    inlines = [ItemImageInline]
    autocomplete_fields = ['owner', 'category']


@admin.register(ItemImage)
class ItemImageAdmin(admin.ModelAdmin):
    list_display = ('item', 'is_primary', 'uploaded_at')
    list_filter = ('is_primary', 'uploaded_at')
    search_fields = ('item__title',)


@admin.register(ItemReview)
class ItemReviewAdmin(admin.ModelAdmin):
    list_display = ('item', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('item__title', 'user__email', 'comment')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'item')
    search_fields = ('user__email', 'item__title')
