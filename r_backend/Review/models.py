from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from Items.models import Item
from Rental.models import Booking

User = get_user_model()


class ItemReview(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='reviews')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='item_review', null=True, blank=True)
    # ✅ FIX: Changed related_name to avoid conflict
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='item_reviews_given')
    
    # Rating categories
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5 stars)"
    )
    condition_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Item condition rating"
    )
    accuracy_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Description accuracy rating"
    )
    value_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Value for money rating"
    )
    
    # Review content
    title = models.CharField(max_length=200, help_text="Review title/summary")
    comment = models.TextField(help_text="Detailed review")
    
    # Review metadata
    pros = models.TextField(blank=True, help_text="What you liked (optional)")
    cons = models.TextField(blank=True, help_text="What could be improved (optional)")
    
    # Recommendation
    would_recommend = models.BooleanField(default=True, help_text="Would you recommend this item?")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Helpfulness tracking
    helpful_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['item', 'reviewer', 'booking']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['item', '-overall_rating']),
        ]
    
    def __str__(self):  # ✅ FIX: Was _str_ should be __str__
        return f"{self.reviewer.user_name} reviewed {self.item.name} - {self.overall_rating}★"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Update item's average rating
        if is_new or self.overall_rating:
            try:
                self.item.update_rating()
            except AttributeError:
                pass  # Item model doesn't have update_rating method


class OwnerReview(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_reviews_received')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='owner_review', null=True, blank=True)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_reviews_given')
    
    # Rating categories
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5 stars)"
    )
    communication_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Communication quality"
    )
    responsiveness_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Response time"
    )
    friendliness_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Friendliness and professionalism"
    )
    
    # Review content
    title = models.CharField(max_length=200, help_text="Review title")
    comment = models.TextField(help_text="Detailed review")
    
    # Recommendation
    would_rent_again = models.BooleanField(default=True, help_text="Would you rent from this owner again?")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Helpfulness tracking
    helpful_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'reviewer', 'booking']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['owner', '-overall_rating']),
        ]
    
    def __str__(self):  # ✅ FIX: Was _str_ should be __str__
        return f"{self.reviewer.user_name} reviewed owner {self.owner.user_name} - {self.overall_rating}★"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Update owner's average rating
        if is_new or self.overall_rating:
            try:
                self.owner.update_rating()
            except AttributeError:
                pass  # User model doesn't have update_rating method


class RenterReview(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_reviews_received')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='renter_review', null=True, blank=True)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_reviews_given')
    
    # Rating categories
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5 stars)"
    )
    item_care_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="How well they took care of the item"
    )
    communication_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Communication quality"
    )
    return_condition_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Condition of item upon return"
    )
    punctuality_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Returned on time"
    )
    
    # Review content
    title = models.CharField(max_length=200, help_text="Review title")
    comment = models.TextField(help_text="Detailed review")
    
    # Item return details
    returned_clean = models.BooleanField(default=True, help_text="Was the item returned clean?")
    returned_on_time = models.BooleanField(default=True, help_text="Was the item returned on time?")
    any_damage = models.BooleanField(default=False, help_text="Was there any damage?")
    damage_description = models.TextField(blank=True, help_text="Describe any damage")
    
    # Recommendation
    would_rent_to_again = models.BooleanField(default=True, help_text="Would you rent to this person again?")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Helpfulness tracking
    helpful_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['renter', 'reviewer', 'booking']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['renter', '-overall_rating']),
        ]
    
    def __str__(self):  # ✅ FIX: Was _str_ should be __str__
        return f"{self.reviewer.user_name} reviewed renter {self.renter.user_name} - {self.overall_rating}★"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Update renter's average rating
        if is_new or self.overall_rating:
            try:
                self.renter.update_rating()
            except AttributeError:
                pass  # User model doesn't have update_rating method


class ReviewHelpful(models.Model):
    REVIEW_TYPES = [
        ('item', 'Item Review'),
        ('owner', 'Owner Review'),
        ('renter', 'Renter Review'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='helpful_votes')
    review_type = models.CharField(max_length=10, choices=REVIEW_TYPES)
    review_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'review_type', 'review_id']
        indexes = [
            models.Index(fields=['review_type', 'review_id']),
        ]
    
    def __str__(self):  # ✅ FIX: Was _str_ should be __str__
        return f"{self.user.user_name} found {self.review_type} review #{self.review_id} helpful"


class ReviewResponse(models.Model):
    """
    Allow review subjects to respond to reviews
    """
    REVIEW_TYPES = [
        ('item', 'Item Review'),
        ('owner', 'Owner Review'),
        ('renter', 'Renter Review'),
    ]
    
    review_type = models.CharField(max_length=10, choices=REVIEW_TYPES)
    review_id = models.IntegerField()
    responder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='review_responses')
    response = models.TextField(help_text="Response to the review")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['review_type', 'review_id', 'responder']
        ordering = ['-created_at']
    
    def __str__(self):  # ✅ FIX: Was _str_ should be __str__
        return f"Response to {self.review_type} review #{self.review_id}"