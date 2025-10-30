from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ItemReview, OwnerReview, RenterReview, ReviewHelpful, ReviewResponse
from Items.models import Item
from Rental.models import Booking

User = get_user_model()


class ReviewUserSerializer(serializers.ModelSerializer):
    """Minimal user info for reviews"""
    class Meta:
        model = User
        fields = ['id', 'user_name', 'profile_image', 'rating']


class ItemReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewUserSerializer(read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_image = serializers.SerializerMethodField()
    is_helpful = serializers.SerializerMethodField()
    has_response = serializers.SerializerMethodField()
    response = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = ItemReview
        fields = [
            'id', 'item', 'item_name', 'item_image', 'booking', 'reviewer',
            'overall_rating', 'condition_rating', 'accuracy_rating', 'value_rating',
            'average_rating', 'title', 'comment', 'pros', 'cons',
            'would_recommend', 'helpful_count', 'is_helpful', 
            'has_response', 'response', 'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewer', 'helpful_count', 'created_at', 'updated_at']
    
    def get_item_image(self, obj):
        try:
            if obj.item.images.exists():
                primary_image = obj.item.images.filter(is_primary=True).first()
                if primary_image:
                    return primary_image.image.url if primary_image.image else None
                # Fallback to first image
                first_image = obj.item.images.first()
                return first_image.image.url if first_image and first_image.image else None
        except Exception:
            pass
        return None
    
    def get_is_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ReviewHelpful.objects.filter(
                user=request.user,
                review_type='item',
                review_id=obj.id
            ).exists()
        return False
    
    def get_has_response(self, obj):
        return ReviewResponse.objects.filter(
            review_type='item',
            review_id=obj.id
        ).exists()
    
    def get_response(self, obj):
        response = ReviewResponse.objects.filter(
            review_type='item',
            review_id=obj.id
        ).first()
        if response:
            return {
                'responder': response.responder.user_name,
                'response': response.response,
                'created_at': response.created_at
            }
        return None
    
    def get_average_rating(self, obj):
        return round((
            obj.overall_rating + 
            obj.condition_rating + 
            obj.accuracy_rating + 
            obj.value_rating
        ) / 4, 1)
    
    def validate(self, data):
        request = self.context.get('request')
        item = data.get('item')
        booking = data.get('booking')
        
        # Check if user is the renter
        if booking and booking.renter != request.user:
            raise serializers.ValidationError("You can only review items you've rented")
        
        # Check if booking is completed
        if booking and booking.status != 'completed':
            raise serializers.ValidationError("You can only review completed rentals")
        
        # Check if already reviewed
        if ItemReview.objects.filter(item=item, reviewer=request.user, booking=booking).exists():
            raise serializers.ValidationError("You have already reviewed this rental")
        
        return data
    
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)


class ItemReviewListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing reviews"""
    reviewer = ReviewUserSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = ItemReview
        fields = [
            'id', 'reviewer', 'overall_rating', 'average_rating',
            'title', 'comment', 'would_recommend', 'helpful_count', 'created_at'
        ]
    
    def get_average_rating(self, obj):
        return round((
            obj.overall_rating + 
            obj.condition_rating + 
            obj.accuracy_rating + 
            obj.value_rating
        ) / 4, 1)


class OwnerReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewUserSerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.user_name', read_only=True)
    is_helpful = serializers.SerializerMethodField()
    has_response = serializers.SerializerMethodField()
    response = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = OwnerReview
        fields = [
            'id', 'owner', 'owner_name', 'booking', 'reviewer',
            'overall_rating', 'communication_rating', 'responsiveness_rating', 
            'friendliness_rating', 'average_rating', 'title', 'comment',
            'would_rent_again', 'helpful_count', 'is_helpful',
            'has_response', 'response', 'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewer', 'helpful_count', 'created_at', 'updated_at']
    
    def get_is_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ReviewHelpful.objects.filter(
                user=request.user,
                review_type='owner',
                review_id=obj.id
            ).exists()
        return False
    
    def get_has_response(self, obj):
        return ReviewResponse.objects.filter(
            review_type='owner',
            review_id=obj.id
        ).exists()
    
    def get_response(self, obj):
        response = ReviewResponse.objects.filter(
            review_type='owner',
            review_id=obj.id
        ).first()
        if response:
            return {
                'responder': response.responder.user_name,
                'response': response.response,
                'created_at': response.created_at
            }
        return None
    
    def get_average_rating(self, obj):
        return round((
            obj.overall_rating + 
            obj.communication_rating + 
            obj.responsiveness_rating + 
            obj.friendliness_rating
        ) / 4, 1)
    
    def validate(self, data):
        request = self.context.get('request')
        owner = data.get('owner')
        booking = data.get('booking')
        
        # Check if user is the renter
        if booking and booking.renter != request.user:
            raise serializers.ValidationError("You can only review owners you've rented from")
        
        # Check if booking is completed
        if booking and booking.status != 'completed':
            raise serializers.ValidationError("You can only review completed rentals")
        
        # Check if already reviewed
        if OwnerReview.objects.filter(owner=owner, reviewer=request.user, booking=booking).exists():
            raise serializers.ValidationError("You have already reviewed this owner")
        
        return data
    
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)


class RenterReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewUserSerializer(read_only=True)
    renter_name = serializers.CharField(source='renter.user_name', read_only=True)
    is_helpful = serializers.SerializerMethodField()
    has_response = serializers.SerializerMethodField()
    response = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = RenterReview
        fields = [
            'id', 'renter', 'renter_name', 'booking', 'reviewer',
            'overall_rating', 'item_care_rating', 'communication_rating',
            'return_condition_rating', 'punctuality_rating', 'average_rating',
            'title', 'comment', 'returned_clean', 'returned_on_time',
            'any_damage', 'damage_description', 'would_rent_to_again',
            'helpful_count', 'is_helpful', 'has_response', 'response',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewer', 'helpful_count', 'created_at', 'updated_at']
    
    def get_is_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ReviewHelpful.objects.filter(
                user=request.user,
                review_type='renter',
                review_id=obj.id
            ).exists()
        return False
    
    def get_has_response(self, obj):
        return ReviewResponse.objects.filter(
            review_type='renter',
            review_id=obj.id
        ).exists()
    
    def get_response(self, obj):
        response = ReviewResponse.objects.filter(
            review_type='renter',
            review_id=obj.id
        ).first()
        if response:
            return {
                'responder': response.responder.user_name,
                'response': response.response,
                'created_at': response.created_at
            }
        return None
    
    def get_average_rating(self, obj):
        return round((
            obj.overall_rating + 
            obj.item_care_rating + 
            obj.communication_rating + 
            obj.return_condition_rating +
            obj.punctuality_rating
        ) / 5, 1)
    
    def validate(self, data):
        request = self.context.get('request')
        renter = data.get('renter')
        booking = data.get('booking')
        
        # Check if user is the owner
        if booking and booking.owner != request.user:
            raise serializers.ValidationError("You can only review your renters")
        
        # Check if booking is completed
        if booking and booking.status != 'completed':
            raise serializers.ValidationError("You can only review completed rentals")
        
        # Check if already reviewed
        if RenterReview.objects.filter(renter=renter, reviewer=request.user, booking=booking).exists():
            raise serializers.ValidationError("You have already reviewed this renter")
        
        # Validate damage description
        if data.get('any_damage') and not data.get('damage_description'):
            raise serializers.ValidationError("Please provide damage description")
        
        return data
    
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)


class ReviewResponseSerializer(serializers.ModelSerializer):
    responder = ReviewUserSerializer(read_only=True)
    
    class Meta:
        model = ReviewResponse
        fields = ['id', 'review_type', 'review_id', 'responder', 'response', 'created_at', 'updated_at']
        read_only_fields = ['responder', 'created_at', 'updated_at']
    
    def validate(self, data):
        request = self.context.get('request')
        review_type = data.get('review_type')
        review_id = data.get('review_id')
        
        # Check if review exists and user is the subject of the review
        if review_type == 'item':
            review = ItemReview.objects.filter(id=review_id).first()
            if not review or review.item.owner != request.user:
                raise serializers.ValidationError("You can only respond to reviews of your items")
        
        elif review_type == 'owner':
            review = OwnerReview.objects.filter(id=review_id).first()
            if not review or review.owner != request.user:
                raise serializers.ValidationError("You can only respond to your own reviews")
        
        elif review_type == 'renter':
            review = RenterReview.objects.filter(id=review_id).first()
            if not review or review.renter != request.user:
                raise serializers.ValidationError("You can only respond to your own reviews")
        
        # Check if already responded
        if ReviewResponse.objects.filter(
            review_type=review_type,
            review_id=review_id,
            responder=request.user
        ).exists():
            raise serializers.ValidationError("You have already responded to this review")
        
        return data
    
    def create(self, validated_data):
        validated_data['responder'] = self.context['request'].user
        return super().create(validated_data)


class ReviewStatsSerializer(serializers.Serializer):
    """Statistics for reviews"""
    total_reviews = serializers.IntegerField()
    average_rating = serializers.FloatField()
    rating_distribution = serializers.DictField()
    recent_reviews = serializers.ListField()