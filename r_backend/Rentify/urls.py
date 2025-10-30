from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # ✅ Keep both paths pointing to same Authentication app
    path('auth/', include('Authentication.urls')),  # Keep for backward compatibility
    path('api/auth/', include('Authentication.urls')),  # Add this for /api/auth/user/profile/
    path('api/users/', include('Authentication.urls')),  # Add this for /api/users/me/
    
    # Other App Endpoints
    path('api/', include('Items.urls')),
    path('api/', include('Rental.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/reviews/', include('Review.urls')),

    # re_path(r"^(?!api/).*", TemplateView.as_view(template_name="index.html")),
]