# urls.py
from django.urls import path
from .views import (
    CategoryListCreateView, CategoryRetrieveUpdateDestroyView,
    ItemListCreateView, ItemRetrieveUpdateDestroyView,
    ItemImageListCreateView, ItemImageRetrieveUpdateDestroyView,ItemReviewListCreateView,WishlistListCreateView
)

urlpatterns = [
    # Category endpoints
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<str:name>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),

    # Item endpoints
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<str:name>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),

    # ItemImage endpoints
    path('item-images/', ItemImageListCreateView.as_view(), name='item-image-list-create'),
    path('item-images/<int:pk>/', ItemImageRetrieveUpdateDestroyView.as_view(), name='item-image-detail'),

     path('reviews/', ItemReviewListCreateView.as_view(), name='item-review'),
      path('wishlist/', WishlistListCreateView.as_view(), name='wishlist'),
]
