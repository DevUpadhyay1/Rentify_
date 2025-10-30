# from django.db import models
# from django.contrib.auth import get_user_model
# from django.core.validators import MinValueValidator, MaxValueValidator

# User = get_user_model()

# # Create your models here.
# class ItemReview(models.Model):
#     item = models.ForeignKey('Items.Item', on_delete=models.CASCADE, related_name='reviews')
#     user = models.ForeignKey(User, on_delete=models.CASCADE)  # the one who gave review
#     rating = models.IntegerField(validators=[MinValueValidator(1.0), MaxValueValidator(5)])
#     review = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ['item', 'user']  # prevent multiple reviews by same user

# class RenterReview(models.Model):
#     renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_reviews')  # the person who rented
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_reviews')  # who gave review
#     rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
#     feedback = models.TextField(blank=True)
#     rental = models.ForeignKey('Rental.Rental', on_delete=models.CASCADE)  # link to the rental record
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ['renter', 'owner', 'rental']
