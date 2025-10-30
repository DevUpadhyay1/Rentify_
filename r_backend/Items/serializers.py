from rest_framework import serializers
from .models import Category, SubCategory, Item, ItemImage, Wishlist
import imghdr
from .utils import upload_to_firebase

class CategorySerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'image_file', 'is_approved', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_approved']

    def validate_image_file(self, image):
        image_type = imghdr.what(image)
        if image_type not in ['jpeg', 'png', 'gif', 'webp']:
            raise serializers.ValidationError("Unsupported image type.")
        return image

    def create(self, validated_data):
        image = validated_data.pop('image_file', None)
        category = Category.objects.create(**validated_data)
        if image:
            try:
                url = upload_to_firebase(image)
                category.icon = url
                category.save()
            except:
                raise serializers.ValidationError({"icon": "Image upload failed."})
        return category

    def update(self, instance, validated_data):
        image = validated_data.pop('image_file', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image:
            try:
                url = upload_to_firebase(image)
                instance.icon = url
            except:
                raise serializers.ValidationError({"icon": "Image upload failed."})
        instance.save()
        return instance

class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source='category'
    )

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category', 'category_id']


class ItemImageSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True)

    class Meta:
        model = ItemImage
        fields = ['id', 'item', 'image_url', 'is_primary', 'uploaded_at', 'image_file']
        read_only_fields = ['id', 'image_url', 'uploaded_at']

    def validate_image_file(self, image):
        image_type = imghdr.what(image)
        if image_type not in ['jpeg', 'png', 'gif', 'webp']:
            raise serializers.ValidationError("Invalid image format.")
        return image

    def create(self, validated_data):
        image = validated_data.pop('image_file')
        url = upload_to_firebase(image)
        validated_data['image_url'] = url
        return ItemImage.objects.create(**validated_data)


class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source='category'
    )
    subcategory_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), write_only=True, source='subcategory', required=False
    )

    category = CategorySerializer(read_only=True)
    subcategory = SubCategorySerializer(read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'description', 'price',
            'category', 'category_id',
            'subcategory', 'subcategory_id',
            'created_at', 'images'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        category = data.get('category')
        subcategory = data.get('subcategory')

        subcategories = SubCategory.objects.filter(category=category)
        if subcategories.exists() and not subcategory:
            raise serializers.ValidationError("This category has subcategories. Please select one.")
        elif not subcategories.exists() and subcategory:
            raise serializers.ValidationError("This category has no subcategories. Do not provide subcategory.")
        elif subcategory and subcategory.category != category:
            raise serializers.ValidationError("Subcategory does not belong to the selected category.")

        return data


class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    item = serializers.StringRelatedField()

    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['user']
