# serializers.py
from rest_framework import serializers
from .models import Category
import imghdr

class CategorySerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'image_file', 'is_approved', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_approved', 'icon']  # is_approved only by admin

    def validate_image_file(self, image):
        # Check valid image type
        image_type = imghdr.what(image)
        if image_type not in ['jpeg', 'png', 'gif', 'webp']:
            raise serializers.ValidationError("Unsupported image type. Only jpeg, png, gif, webp allowed.")
        return image

    def create(self, validated_data):
        image = validated_data.pop('image_file', None)
        category = Category.objects.create(**validated_data)

        if image:
            # Simulate Firebase upload — replace this with real logic
            # Assuming you have a function `upload_to_firebase(image)` that returns a URL
            from .utils import upload_to_firebase
            url = upload_to_firebase(image)
            category.icon = url
            category.save()

        return category
