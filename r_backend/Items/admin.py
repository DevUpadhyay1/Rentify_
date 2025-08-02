# from django.contrib import admin
# from .models import Category, Item, ItemImage, ItemReview, Wishlist


# @admin.register(Category)
# class CategoryAdmin(admin.ModelAdmin):
#     list_display = ('name', 'description', 'icon', 'created_at')
#     search_fields = ('name', 'description')
#     list_filter = ('created_at',)
#     ordering = ('-created_at',)


# class ItemImageInline(admin.TabularInline):
#     model = ItemImage
#     extra = 1
#     fields = ('image', 'is_primary', 'uploaded_at')
#     readonly_fields = ('uploaded_at',)


# @admin.register(Item)
# class ItemAdmin(admin.ModelAdmin):
#     list_display = (
#         'title', 'owner', 'category', 'price_per_day',
#         'availability_status', 'condition', 'location',
#         'rating', 'created_at'
#     )
#     list_filter = (
#         'availability_status', 'condition',
#         'category', 'created_at'
#     )
#     search_fields = (
#         'title', 'description', 'location', 'owner__email', 'category__name'
#     )
#     inlines = [ItemImageInline]
#     autocomplete_fields = ('owner', 'category')
#     readonly_fields = ('created_at',)
#     ordering = ('-created_at',)


# @admin.register(ItemImage)
# class ItemImageAdmin(admin.ModelAdmin):
#     list_display = ('item', 'is_primary', 'uploaded_at')
#     list_filter = ('is_primary', 'uploaded_at')
#     search_fields = ('item__title',)
#     autocomplete_fields = ('item',)
#     readonly_fields = ('uploaded_at',)


# @admin.register(ItemReview)
# class ItemReviewAdmin(admin.ModelAdmin):
#     list_display = ('item', 'user', 'rating', 'created_at')
#     list_filter = ('rating', 'created_at')
#     search_fields = ('item__title', 'user__email', 'comment')
#     autocomplete_fields = ('item', 'user')
#     readonly_fields = ('created_at',)


# @admin.register(Wishlist)
# class WishlistAdmin(admin.ModelAdmin):
#     list_display = ('user', 'item')
#     search_fields = ('user__email', 'item__title')
#     autocomplete_fields = ('user', 'item')
