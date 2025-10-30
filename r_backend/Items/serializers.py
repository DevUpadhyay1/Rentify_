from rest_framework import serializers
from .models import Category, SubCategory, Item, ItemImage, Wishlist
import imghdr
from datetime import datetime
from .utils import upload_to_firebase, delete_from_firebase


class CategorySerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'icon',
            'image_file', 'is_approved', 'created_at'
        ]
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
                folder_path = f"category_icons/{category.id}"
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"icon_{timestamp}.{image.name.split('.')[-1]}"
                
                url = upload_to_firebase(image, folder_path, filename)
                category.icon = url
                category.save(update_fields=['icon'])
            except Exception as e:
                category.delete()
                raise serializers.ValidationError({"icon": f"Image upload failed: {str(e)}"})
        return category

    def update(self, instance, validated_data):
        image = validated_data.pop('image_file', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if image:
            try:
                if instance.icon:
                    delete_from_firebase(instance.icon)
                
                folder_path = f"category_icons/{instance.id}"
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"icon_{timestamp}.{image.name.split('.')[-1]}"
                
                url = upload_to_firebase(image, folder_path, filename)
                instance.icon = url
            except Exception as e:
                raise serializers.ValidationError({"icon": f"Image upload failed: {str(e)}"})

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
        item = validated_data.get('item')
        is_primary = validated_data.get('is_primary', False)
        
        try:
            folder_path = f"item_images/{item.id}"
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            
            if is_primary:
                filename = f"primary_{timestamp}.{image.name.split('.')[-1]}"
            else:
                filename = f"image_{timestamp}.{image.name.split('.')[-1]}"
            
            url = upload_to_firebase(image, folder_path, filename)
            validated_data['image_url'] = url
            
            return ItemImage.objects.create(**validated_data)
        except Exception as e:
            raise serializers.ValidationError({"image": f"Image upload failed: {str(e)}"})


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
    
    is_available = serializers.SerializerMethodField()
    owner_details = serializers.SerializerMethodField()
    
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'description', 'price_per_day',
            'category', 'category_id',
            'subcategory', 'subcategory_id',
            'location', 'deposit_required',
            'minimum_rental_days', 'maximum_rental_days',
            'condition', 'availability_status', 'is_available',
            'owner', 'owner_details', 'owner_id', 'rating', 'total_ratings',
            'created_at', 'images'
        ]
        read_only_fields = ['id', 'created_at', 'is_available', 'owner', 'owner_id', 'rating', 'total_ratings']

    def get_is_available(self, obj):
        try:
            return obj.is_available
        except Exception as e:
            print(f"❌ Error checking availability for item {obj.id}: {e}")
            return obj.availability_status == 'AVAILABLE'

    def get_owner_details(self, obj):
        """
        ✅ FIXED: Use user_name (not username) from CustomUser model
        """
        try:
            user = obj.owner
            
            return {
                'id': user.id,
                'user_name': user.user_name,  # ✅ Match your CustomUser model
                'email': user.email,
                'phone': user.phone or 'Not provided',
                'address': user.address or 'Not specified',
                'profile_image': user.profile_image,
                'rating': str(user.rating) if user.rating else '0.00',
                'total_ratings': user.total_ratings,
            }
        except Exception as e:
            import traceback
            print(f"❌ Error fetching owner details for item {obj.id}:")
            print(traceback.format_exc())
            
            return {
                'id': obj.owner_id if hasattr(obj, 'owner_id') else None,
                'user_name': 'Unknown',
                'email': 'Not available',
                'phone': 'Not available',
                'address': 'Not available',
                'profile_image': None,
                'rating': '0.00',
                'total_ratings': 0,
            }

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
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), write_only=True, source='item'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'item', 'item_id']
        read_only_fields = ['user']