from django.urls import path
from . import views

urlpatterns = [
    
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<str:name>/', views.CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),

   
    path('subcategories/', views.SubCategoryListCreateView.as_view(), name='subcategory-list-create'),
    path('subcategories/<int:pk>/', views.SubCategoryRetrieveUpdateDestroyView.as_view(), name='subcategory-detail'),

    
    path('items/', views.ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<str:name>/', views.ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),

    
    path('item-images/', views.ItemImageListCreateView.as_view(), name='item-image-list-create'),
    path('item-images/<int:pk>/', views.ItemImageRetrieveUpdateDestroyView.as_view(), name='item-image-detail'),
  
    path('wishlists/', views.WishlistListCreateView.as_view(), name='wishlist-list-create'),
]
