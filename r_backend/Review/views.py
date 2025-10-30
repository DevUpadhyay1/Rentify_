from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404

from .models import ItemReview, OwnerReview, RenterReview, ReviewHelpful, ReviewResponse
from .serializers import (
    ItemReviewSerializer, ItemReviewListSerializer,
    OwnerReviewSerializer, RenterReviewSerializer,
    ReviewResponseSerializer, ReviewStatsSerializer
)
from Items.models import Item
from Rental.models import Booking
from django.contrib.auth import get_user_model

User = get_user_model()


class ItemReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all reviews for an item
    POST: Create a new review for an item
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ItemReviewSerializer
        return ItemReviewListSerializer
    
    def get_queryset(self):
        item_id = self.request.query_params.get('item')
        if item_id:
            return ItemReview.objects.filter(item_id=item_id).select_related('reviewer', 'item')
        return ItemReview.objects.all().select_related('reviewer', 'item')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        
        return Response({
            'message': 'Review submitted successfully!',
            'review': ItemReviewSerializer(review, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class ItemReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific item review
    PUT/PATCH: Update own review
    DELETE: Delete own review
    """
    queryset = ItemReview.objects.all()
    serializer_class = ItemReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only edit your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only delete your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().destroy(request, *args, **kwargs)


class OwnerReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all reviews for an owner
    POST: Create a new review for an owner
    """
    serializer_class = OwnerReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        owner_id = self.request.query_params.get('owner')
        if owner_id:
            return OwnerReview.objects.filter(owner_id=owner_id).select_related('reviewer', 'owner')
        return OwnerReview.objects.all().select_related('reviewer', 'owner')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        
        return Response({
            'message': 'Owner review submitted successfully!',
            'review': OwnerReviewSerializer(review, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class OwnerReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific owner review
    PUT/PATCH: Update own review
    DELETE: Delete own review
    """
    queryset = OwnerReview.objects.all()
    serializer_class = OwnerReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only edit your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only delete your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().destroy(request, *args, **kwargs)


class RenterReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all reviews for a renter
    POST: Create a new review for a renter
    """
    serializer_class = RenterReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        renter_id = self.request.query_params.get('renter')
        if renter_id:
            return RenterReview.objects.filter(renter_id=renter_id).select_related('reviewer', 'renter')
        return RenterReview.objects.all().select_related('reviewer', 'renter')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        
        return Response({
            'message': 'Renter review submitted successfully!',
            'review': RenterReviewSerializer(review, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class RenterReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific renter review
    PUT/PATCH: Update own review
    DELETE: Delete own review
    """
    queryset = RenterReview.objects.all()
    serializer_class = RenterReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only edit your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.reviewer != request.user:
            return Response({
                'error': 'You can only delete your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().destroy(request, *args, **kwargs)


class ReviewResponseCreateView(generics.CreateAPIView):
    """
    POST: Create a response to a review
    """
    serializer_class = ReviewResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        response = serializer.save()
        
        return Response({
            'message': 'Response submitted successfully!',
            'response': ReviewResponseSerializer(response).data
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_helpful(request):
    """
    Toggle helpful vote for a review
    """
    review_type = request.data.get('review_type')
    review_id = request.data.get('review_id')
    
    if not review_type or not review_id:
        return Response({
            'error': 'review_type and review_id are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get or create helpful vote
    helpful, created = ReviewHelpful.objects.get_or_create(
        user=request.user,
        review_type=review_type,
        review_id=review_id
    )
    
    if not created:
        # Remove vote
        helpful.delete()
        
        # Update review helpful count
        if review_type == 'item':
            review = ItemReview.objects.filter(id=review_id).first()
        elif review_type == 'owner':
            review = OwnerReview.objects.filter(id=review_id).first()
        else:
            review = RenterReview.objects.filter(id=review_id).first()
        
        if review:
            review.helpful_count = max(0, review.helpful_count - 1)
            review.save()
        
        return Response({
            'message': 'Helpful vote removed',
            'is_helpful': False
        }, status=status.HTTP_200_OK)
    else:
        # Add vote
        if review_type == 'item':
            review = ItemReview.objects.filter(id=review_id).first()
        elif review_type == 'owner':
            review = OwnerReview.objects.filter(id=review_id).first()
        else:
            review = RenterReview.objects.filter(id=review_id).first()
        
        if review:
            review.helpful_count += 1
            review.save()
        
        return Response({
            'message': 'Marked as helpful',
            'is_helpful': True
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def item_review_stats(request, item_id):
    """
    Get review statistics for an item
    """
    reviews = ItemReview.objects.filter(item_id=item_id)
    
    if not reviews.exists():
        return Response({
            'total_reviews': 0,
            'average_rating': 0,
            'rating_distribution': {str(i): 0 for i in range(1, 6)},
            'recent_reviews': []
        }, status=status.HTTP_200_OK)
    
    # Calculate stats
    total_reviews = reviews.count()
    average_rating = round(reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'], 1)
    
    # Rating distribution
    rating_distribution = {}
    for i in range(1, 6):
        count = reviews.filter(overall_rating=i).count()
        rating_distribution[str(i)] = count
    
    # Recent reviews
    recent_reviews = reviews.order_by('-created_at')[:5]
    recent_reviews_data = ItemReviewListSerializer(recent_reviews, many=True).data
    
    return Response({
        'total_reviews': total_reviews,
        'average_rating': average_rating,
        'rating_distribution': rating_distribution,
        'recent_reviews': recent_reviews_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def user_review_stats(request, user_id):
    """
    Get review statistics for a user (as owner and as renter)
    """
    user = get_object_or_404(User, id=user_id)
    
    # Owner reviews
    owner_reviews = OwnerReview.objects.filter(owner=user)
    owner_stats = {
        'total_reviews': owner_reviews.count(),
        'average_rating': round(owner_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0, 1),
        'rating_distribution': {
            str(i): owner_reviews.filter(overall_rating=i).count() for i in range(1, 6)
        }
    }
    
    # Renter reviews
    renter_reviews = RenterReview.objects.filter(renter=user)
    renter_stats = {
        'total_reviews': renter_reviews.count(),
        'average_rating': round(renter_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0, 1),
        'rating_distribution': {
            str(i): renter_reviews.filter(overall_rating=i).count() for i in range(1, 6)
        }
    }
    
    return Response({
        'as_owner': owner_stats,
        'as_renter': renter_stats
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reviews(request):
    """
    Get all reviews written by and about the authenticated user
    """
    user = request.user
    
    # Reviews given by user
    item_reviews_given = ItemReview.objects.filter(reviewer=user).select_related('item', 'booking')
    owner_reviews_given = OwnerReview.objects.filter(reviewer=user).select_related('owner', 'booking')
    renter_reviews_given = RenterReview.objects.filter(reviewer=user).select_related('renter', 'booking')
    
    # Reviews received by user (as owner)
    owner_reviews_received = OwnerReview.objects.filter(owner=user).select_related('reviewer', 'booking')
    
    # Reviews received by user (as renter)
    renter_reviews_received = RenterReview.objects.filter(renter=user).select_related('reviewer', 'booking')
    
    # Item reviews for user's items
    item_reviews_received = ItemReview.objects.filter(item__owner=user).select_related('reviewer', 'item', 'booking')
    
    # Format reviews with metadata
    def format_review(review, review_type):
        base_data = {
            'id': review.id,
            'rating': review.overall_rating,
            'title': review.title,
            'comment': review.comment,
            'created_at': review.created_at,
            'review_type': review_type,
            'reviewer_name': review.reviewer.user_name,
        }
        
        if review_type == 'item':
            base_data['item_name'] = review.item.name
            base_data['item_id'] = review.item.id
        elif review_type == 'owner':
            base_data['target_name'] = review.owner.user_name
            base_data['target_id'] = review.owner.id
        elif review_type == 'renter':
            base_data['target_name'] = review.renter.user_name
            base_data['target_id'] = review.renter.id
        
        return base_data
    
    return Response({
        'received': (
            [format_review(r, 'item') for r in item_reviews_received] +
            [format_review(r, 'owner') for r in owner_reviews_received] +
            [format_review(r, 'renter') for r in renter_reviews_received]
        ),
        'given': (
            [format_review(r, 'item') for r in item_reviews_given] +
            [format_review(r, 'owner') for r in owner_reviews_given] +
            [format_review(r, 'renter') for r in renter_reviews_given]
        )
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_reviews(request):
    """
    ✅ FIXED: Get all completed bookings that need reviews
    """
    user = request.user
    
    try:
        # Get completed bookings where user was the renter
        completed_bookings = Booking.objects.filter(
            renter=user,
            status="completed",
        ).select_related("item", "owner").prefetch_related("item__images")

        pending_reviews = []

        for booking in completed_bookings:
            # Check if reviews exist using hasattr (OneToOne relationship)
            has_item_review = hasattr(booking, 'item_review') and booking.item_review is not None
            has_owner_review = hasattr(booking, 'owner_review') and booking.owner_review is not None

            # Only include if at least one review is missing
            if not has_item_review or not has_owner_review:
                # Get first image
                item_image = None
                try:
                    if booking.item.images.exists():
                        first_image = booking.item.images.first()
                        if first_image and first_image.image:
                            item_image = first_image.image.url
                except Exception:
                    pass

                pending_reviews.append({
                    "booking_id": booking.id,
                    "item_id": booking.item.id,
                    "item_name": booking.item.name,
                    "item_image": item_image,
                    "owner_id": booking.owner.id,
                    "owner_name": booking.owner.user_name,
                    "start_date": booking.start_date.isoformat(),
                    "end_date": booking.end_date.isoformat(),
                    "needs_item_review": not has_item_review,
                    "needs_owner_review": not has_owner_review,
                })

        return Response(pending_reviews, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )