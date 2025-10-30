from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
from django.db import models

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extrafields):
        if not email:
            raise ValueError("Email is Required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extrafields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extrafields):
        extrafields.setdefault('is_staff', True)
        extrafields.setdefault('is_superuser', True)
        extrafields.setdefault('is_active', True)

        if extrafields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extrafields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extrafields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    user_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True)
    profile_image = models.URLField(max_length=1000, blank=True, null=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    def update_rating(self):
        from Review.models import OwnerReview, RenterReview
        from django.db.models import Avg
        
        owner_reviews = OwnerReview.objects.filter(owner=self)
        owner_avg = owner_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0
        owner_count = owner_reviews.count()
    
        renter_reviews = RenterReview.objects.filter(renter=self)
        renter_avg = renter_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0
        renter_count = renter_reviews.count()
    
    # Calculate combined average
        if owner_count + renter_count > 0:
            total_rating = (owner_avg * owner_count) + (renter_avg * renter_count)
            self.rating = round(total_rating / (owner_count + renter_count), 1)
            self.total_ratings = owner_count + renter_count
        else:
            self.rating = 0
            self.total_ratings = 0
    
        self.save(update_fields=['rating', 'total_ratings'])

