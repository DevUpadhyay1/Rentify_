from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
import pyrebase
from decouple import config
import tempfile
import os
from datetime import datetime
from Items.utils import upload_to_firebase, delete_from_firebase

# Import all email functions from email_templates
from Rental.email_templates import (
    send_verification_email,
    send_password_reset_email,
    send_password_changed_confirmation
)

# # Firebase configuration
# firebaseConfig = {
#     "apiKey": config("FIREBASE_API_KEY"),
#     "authDomain": config("FIREBASE_AUTH_DOMAIN"),
#     "projectId": config("FIREBASE_PROJECT_ID"),
#     "storageBucket": config("FIREBASE_STORAGE_BUCKET"),
#     "messagingSenderId": config("FIREBASE_MESSAGING_SENDER_ID"),
#     "appId": config("FIREBASE_APP_ID"),
#     "databaseURL": "https://rentify-58f75-default-rtdb.firebaseio.com"
# }

# firebase = pyrebase.initialize_app(firebaseConfig)
# storage = firebase.storage()

CustomUser = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['email', 'user_name', 'password']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_user_name(self, value):
        if CustomUser.objects.filter(user_name=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        # Create inactive user
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            user_name=validated_data['user_name'],
            password=validated_data['password']
        )
        user.is_active = False
        user.save()

        # Generate verification URL
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        verify_path = reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})
        verify_url = f"{frontend_url}{verify_path}"

        # Send verification email using the function from email_templates
        try:
            send_verification_email(user, verify_url)
        except Exception as e:
            print(f"❌ Failed to send verification email during registration: {e}")
            # Don't raise exception - allow registration to complete even if email fails

        return user


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        try:
            user = CustomUser.objects.get(email=attrs['email'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"email": "User with this email does not exist"})
        
        if user.is_active:
            raise serializers.ValidationError({"email": "User is already verified"})
        
        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        
        # Generate verification URL
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        verify_path = reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})
        verify_url = f"{frontend_url}{verify_path}"

        # Send verification email using the function from email_templates
        try:
            send_verification_email(user, verify_url)
        except Exception as e:
            print(f"❌ Failed to resend verification email: {e}")
            raise serializers.ValidationError("Failed to send verification email. Please try again later.")

        return {"detail": "Verification email resent successfully"}


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        user = authenticate(email=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise serializers.ValidationError("Please verify your email before logging in")

        refresh = RefreshToken.for_user(user)
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'email': user.email,
            'user_name': user.user_name,
        }



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email")
        return value

    def save(self):
        user = CustomUser.objects.get(email=self.validated_data['email'])
        
        # Generate password reset URL
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reset-password/{uidb64}/{token}"

        # Send password reset email using the function from email_templates
        try:
            send_password_reset_email(user, reset_url)
        except Exception as e:
            print(f"❌ Failed to send password reset email: {e}")
            raise serializers.ValidationError("Failed to send password reset email. Please try again later.")


class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data['uidb64']).decode()
            user = CustomUser.objects.get(pk=uid)
        except Exception:
            raise serializers.ValidationError("Invalid reset link")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token")

        self.user = user
        return data

    def save(self):
        # Update password
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()
        
        # Send confirmation email
        try:
            send_password_changed_confirmation(self.user)
        except Exception as e:
            print(f"❌ Failed to send password changed confirmation: {e}")
            # Don't raise exception - password has already been changed successfully


# ============================================
# USER PROFILE SERIALIZER
# ============================================


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, write_only=True)
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'user_name', 'phone', 'profile_image', 'profile_image_url',
            'address','is_active','rating', 'total_ratings', 'date_joined'
        ]
        read_only_fields = ['email', 'rating', 'total_ratings', 'date_joined', 'profile_image_url']

    def get_profile_image_url(self, obj):
        """
        ✅ Return profile image URL or None (not empty string)
        This prevents the data:;base64,= error
        """
        if obj.profile_image:
            # Check if it's a valid URL
            image_url = str(obj.profile_image).strip()
            if image_url and not image_url.startswith('data:;base64'):
                return image_url
        return None  # ✅ Return None instead of empty string

    def to_representation(self, instance):
        """
        ✅ Customize the output format
        """
        data = super().to_representation(instance)
        # Replace profile_image_url with profile_image
        profile_image_url = data.pop('profile_image_url', None)
        data['profile_image'] = profile_image_url  # ✅ Will be None if no image
        return data

    def update(self, instance, validated_data):
        profile_image = validated_data.pop('profile_image', None)

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle profile image upload to Firebase
        if profile_image:
            try:
                # Delete old image if exists
                if instance.profile_image:
                    old_image_url = str(instance.profile_image).strip()
                    # Only delete if it's a valid Firebase URL
                    if old_image_url and old_image_url.startswith('https://'):
                        delete_from_firebase(old_image_url)
                
                # Upload new image: profile_images/{user_id}/profile_{timestamp}.ext
                folder_path = f"profile_images/{instance.id}"
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"profile_{timestamp}.{profile_image.name.split('.')[-1]}"
                
                image_url = upload_to_firebase(profile_image, folder_path, filename)
                instance.profile_image = image_url
                
            except Exception as e:
                print(f"❌ Image upload error: {str(e)}")
                raise serializers.ValidationError({"profile_image": f"Image upload failed: {str(e)}"})

        instance.save()
        return instance

# ============================================
# LOGOUT SERIALIZER
# ============================================

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            raise serializers.ValidationError("Invalid or expired token")

        