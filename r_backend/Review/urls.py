from django.urls import path
from .views import (
    # Item Reviews
    ItemReviewListCreateView,
    ItemReviewDetailView,
    
    # Owner Reviews
    OwnerReviewListCreateView,
    OwnerReviewDetailView,
    
    # Renter Reviews
    RenterReviewListCreateView,
    RenterReviewDetailView,
    
    # Review Responses
    ReviewResponseCreateView,
    
    # Helper views
    toggle_helpful,
    item_review_stats,
    user_review_stats,
    my_reviews,
    pending_reviews,
)

urlpatterns = [
 
    path('items/', ItemReviewListCreateView.as_view(), name='item-review-list-create'),
    path('items/<int:pk>/', ItemReviewDetailView.as_view(), name='item-review-detail'),
    path('items/stats/<int:item_id>/', item_review_stats, name='item-review-stats'),
    
    path('owners/', OwnerReviewListCreateView.as_view(), name='owner-review-list-create'),
    path('owners/<int:pk>/', OwnerReviewDetailView.as_view(), name='owner-review-detail'),
    
 
    path('renters/', RenterReviewListCreateView.as_view(), name='renter-review-list-create'),
    path('renters/<int:pk>/', RenterReviewDetailView.as_view(), name='renter-review-detail'),
    

    path('responses/', ReviewResponseCreateView.as_view(), name='review-response-create'),
    
   
    path('helpful/', toggle_helpful, name='toggle-helpful'),
    path('user-stats/<int:user_id>/', user_review_stats, name='user-review-stats'),
    path('my-reviews/', my_reviews, name='my-reviews'),
    path('pending/', pending_reviews, name='pending-reviews'),
]