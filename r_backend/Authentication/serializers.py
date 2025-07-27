from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import serializers
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['email', 'user_name', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            user_name=validated_data['user_name'],
            password=validated_data['password']
        )
        user.is_active = False  
        user.save()

        
        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(self.context['request']).domain
        relative_link = reverse('email-verify')
        absurl = f"http://{current_site}{relative_link}?token={str(token)}"
        email_body = f"Hi {user.user_name},\nUse the link below to verify your email:\n{absurl}"
        
        send_mail(
            subject='Verify your email',
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        return user
    
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

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'email': user.email,
            'user_name': user.user_name,
        }
        
class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']

    def create(self, validated_data):
        user = CustomUser.objects.get(email=validated_data['email'])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        activation_link = f"http://localhost:5000/verify-email/{uid}/{token}/"

        send_mail(
            subject="Verify Your Email",
            message=f"Click to verify: {activation_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return {"message": "Verification email sent"}

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email.")
        return value

    def save(self):
        user = CustomUser.objects.get(email=self.validated_data['email'])
        token = RefreshToken.for_user(user).access_token
        reset_url = f"http://localhost:5000/reset-password?token={str(token)}"
        email_body = f"Click the link to reset your password:\n{reset_url}"

        send_mail(
            subject='Reset Your Password',
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField()

    def validate(self, data):
        try:
            token = data.get('token')
            access_token = AccessToken(token)
            self.user = CustomUser.objects.get(id=access_token['user_id'])
            return data
        except:
            raise serializers.ValidationError("Invalid or expired token.")

    def save(self):
        self.user.set_password(self.validated_data['password'])
        self.user.save()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'user_name', 'phone', 'profile_image',
            'address', 'rating', 'total_ratings', 'date_joined'
        ]
        read_only_fields = ['email', 'rating', 'total_ratings', 'date_joined']