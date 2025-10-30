from django.urls import path
from .views import (
    # Categories
    CategoryListCreateView,
    CategoryRetrieveUpdateDestroyView,
    # Subcategories
    SubCategoryListCreateView,
    SubCategoryRetrieveUpdateDestroyView,
    # Items
    ItemListCreateView,
    ItemRetrieveUpdateDestroyView,
    MyItemsListView,
    # Item Images
    ItemImageListCreateView,
    ItemImageRetrieveUpdateDestroyView,
    # Wishlist
    WishlistListCreateView,
    WishlistRetrieveUpdateDestroyView,
    # Locations
    available_cities,
    search_locations,
)

urlpatterns = [
    # Location endpoints
    path('locations/available-cities/', available_cities, name='available-cities'),
    path('locations/search/', search_locations, name='search-locations'),
    
    # Category endpoints
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
    
    # Subcategory endpoints
    path('subcategories/', SubCategoryListCreateView.as_view(), name='subcategory-list-create'),
    path('subcategories/<int:pk>/', SubCategoryRetrieveUpdateDestroyView.as_view(), name='subcategory-detail'),
    
    # Item endpoints
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),
    path('my-items/', MyItemsListView.as_view(), name='my-items'),
    
    # Item Image endpoints
    path('item-images/', ItemImageListCreateView.as_view(), name='itemimage-list-create'),
    path('item-images/<int:pk>/', ItemImageRetrieveUpdateDestroyView.as_view(), name='itemimage-detail'),
    
    # Wishlist endpoints
    path('wishlists/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlists/<int:pk>/', WishlistRetrieveUpdateDestroyView.as_view(), name='wishlist-detail'),
]