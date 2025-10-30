from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    description = models.TextField(blank=True)
    icon = models.URLField(max_length=500,blank=True, null=True)  # Storing Firebase/cloud URL
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Item(models.Model):   
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]
    
    AVAILABILITY_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('RENTED', 'Rented'),
        ('MAINTENANCE', 'Under Maintenance'),
        ('UNAVAILABLE', 'Unavailable'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_items')
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    availability_status = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES,  default='AVAILABLE')
    location = models.CharField(max_length=200)
    deposit_required = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    minimum_rental_days = models.IntegerField(default=1)
    maximum_rental_days = models.IntegerField(default=30)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def update_rating(self):
   
        from Review.models import ItemReview
        from django.db.models import Avg
    
        reviews = ItemReview.objects.filter(item=self)
        avg_rating = reviews.aggregate(Avg('overall_rating'))['overall_rating__avg']
    
        if avg_rating:
            self.rating = round(avg_rating, 1)
            self.total_ratings = reviews.count()
        else:
            self.rating = 0
            self.total_ratings = 0
    
        self.save(update_fields=['rating', 'total_ratings'])


    @property
    def is_available(self):
        """
        ✅ FIXED: Check if item is available RIGHT NOW
        Returns True only if:
        1. availability_status is 'AVAILABLE' (UPPERCASE to match database)
        2. No active rental exists covering current date
        """
        print(f"🔍 Checking availability for Item {self.id} - Status: '{self.availability_status}'")
        
        # ✅ FIXED: Check UPPERCASE to match database
        if self.availability_status != 'AVAILABLE':
            print(f"❌ Item {self.id} - NOT available (status: '{self.availability_status}')")
            return False
        
        try:
            from Rental.models import Booking
            
            now = timezone.now().date()
            print(f"🔍 Checking bookings for Item {self.id} on date: {now}")
            
            # Check for bookings that are CURRENTLY active:
            # - Status is 'confirmed' or 'accepted_by_owner'
            # - Current date falls within rental period
            active_bookings = Booking.objects.filter(
                item=self,
                status__in=['confirmed', 'accepted_by_owner'],
                start_date__lte=now,
                end_date__gte=now
            )
            
            count = active_bookings.count()
            
            if count > 0:
                print(f"❌ Item {self.id} - Has {count} active bookings")
                for booking in active_bookings:
                    print(f"   📌 Booking {booking.id}: {booking.status} ({booking.start_date} to {booking.end_date})")
                return False
            else:
                print(f"✅✅✅ Item {self.id} - AVAILABLE (status: '{self.availability_status}', no active bookings)")
                return True
            
        except Exception as e:
            print(f"⚠️ Error checking bookings for item {self.id}: {e}")
            import traceback
            traceback.print_exc()
            # Fall back to availability_status
            return self.availability_status == 'AVAILABLE'
    
    
    
    
    
class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.item.name} - Image"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'item')
