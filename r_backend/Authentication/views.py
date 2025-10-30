from rest_framework import generics, status, permissions
from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

from .serializers import (
    RegisterSerializer, 
    LoginSerializer,
    ResendVerificationSerializer,
    ForgotPasswordSerializer, 
    ResetPasswordSerializer,
    UserProfileSerializer, 
    LogoutSerializer
)

User = get_user_model()


# ============================================
# REGISTRATION VIEW
# ============================================

class RegisterView(CreateAPIView):
    """
    API endpoint for user registration.
    Creates a new inactive user and sends verification email.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Registration successful. Please check your email to verify your account.',
            'email': user.email,
            'user_name': user.user_name
        }, status=status.HTTP_201_CREATED)


# ============================================
# RESEND VERIFICATION EMAIL VIEW
# ============================================

class ResendVerificationEmail(GenericAPIView):
    """
    API endpoint to resend verification email.
    """
    serializer_class = ResendVerificationSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_200_OK)


# ============================================
# EMAIL VERIFICATION VIEW
# ============================================

class VerifyEmail(GenericAPIView):
    """
    API endpoint to verify user email with token.
    """
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            # Decode user ID
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            # Check if token is valid
            if default_token_generator.check_token(user, token):
                # Activate user account
                user.is_active = True
                user.save()
                return Response({
                    'message': 'Email verified successfully! You can now login.',
                    'email': user.email
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Invalid or expired verification token'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ Email verification error: {e}")
            return Response({
                'error': 'Invalid verification link'
            }, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# CHECK VERIFICATION STATUS VIEW
# ============================================

class CheckVerification(GenericAPIView):
    """
    API endpoint to check if user email is verified.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.GET.get('email')
        
        if not email:
            return Response({
                'detail': 'Email parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            return Response({
                'email': email,
                'is_verified': user.is_active
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'detail': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# LOGIN VIEW
# ============================================

class LoginView(GenericAPIView):
    """
    API endpoint for user login.
    Returns JWT tokens on successful authentication.
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# ============================================
# FORGOT PASSWORD VIEW
# ============================================

class ForgotPasswordView(CreateAPIView):
    """
    API endpoint to request password reset.
    Sends password reset email to user.
    """
    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'detail': 'Password reset email sent. Please check your inbox.'
        }, status=status.HTTP_200_OK)


# ============================================
# RESET PASSWORD VIEW
# ============================================

class ResetPasswordView(GenericAPIView):
    """
    API endpoint to reset password with token.
    """
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'detail': 'Password has been reset successfully. You can now login with your new password.'
        }, status=status.HTTP_200_OK)


# ============================================
# USER PROFILE VIEW
# ============================================

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve and update user profile.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Return the authenticated user's profile"""
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)

class CurrentUserView(generics.RetrieveAPIView):
    """
    API endpoint to get current authenticated user details.
    Handles both:
    - GET /api/auth/user/profile/
    - GET /api/users/me/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Return the authenticated user's profile"""
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        """Override to add custom response format if needed"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ============================================
# LOGOUT VIEW
# ============================================

class LogoutView(GenericAPIView):
    """
    API endpoint to logout user.
    Blacklists the refresh token.
    """
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "detail": "Successfully logged out."
        }, status=status.HTTP_205_RESET_CONTENT)