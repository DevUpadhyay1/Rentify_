from django.urls import path
from .views import (
    RegisterView, LoginView, VerifyEmail, CheckVerification,
    ResendVerificationEmail,
    ForgotPasswordView, ResetPasswordView,
    UserProfileView, LogoutView,
    CurrentUserView  # ✅ Add this import
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    path('verify-email/<uidb64>/<token>/', VerifyEmail.as_view(), name='verify-email'),
    path('check-verification/', CheckVerification.as_view(), name='check-verification'),
    path('resend-verification/', ResendVerificationEmail.as_view(), name='resend-verification'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    
    path('me/', CurrentUserView.as_view(), name='current-user'),
]