from rest_framework import generics, filters, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from django.core.cache import cache
from .models import Category, SubCategory, Item, ItemImage, Wishlist
from .serializers import (
    CategorySerializer, SubCategorySerializer, ItemSerializer, 
    ItemImageSerializer, WishlistSerializer
)


# ==================== LOCATION APIs ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def available_cities(request):
    """
    Get cities where items are available with counts
    """
    cache_key = "available_cities"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)
    
    cities = Item.objects.values('location').annotate(
        count=Count('id')
    ).filter(
        location__isnull=False
    ).exclude(
        location=''
    ).order_by('-count')
    
    result = [{"city": c['location'], "count": c['count'], "has_items": True} for c in cities]
    
    # Cache for 1 hour
    cache.set(cache_key, result, 60*60)
    return Response(result)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_locations(request):
    """
    Smart location search - prioritizes cities with items
    """
    query = request.GET.get('q', '').strip().lower()
    
    if len(query) < 2:
        # Return popular cities
        return available_cities(request)
    
    cache_key = f"location_search_{query}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)
    
    # Search in database first
    db_results = Item.objects.values('location').annotate(
        count=Count('id')
    ).filter(
        location__icontains=query
    ).order_by('-count')[:10]
    
    result = [
        {"city": r['location'], "count": r['count'], "has_items": True} 
        for r in db_results
    ]
    
    # Cache for 30 minutes
    cache.set(cache_key, result, 60*30)
    return Response(result)


# ==================== CATEGORY APIs ====================

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    permission_classes = [AllowAny]


class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'pk'
    permission_classes = [AllowAny]


# ==================== SUBCATEGORY APIs ====================

class SubCategoryListCreateView(generics.ListCreateAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['created_at', 'name']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class SubCategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    lookup_field = 'pk'
    permission_classes = [AllowAny]


# ==================== ITEM APIs ====================

class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['created_at', 'price_per_day', 'name', 'rating']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        
        # Location filter
        location = self.request.query_params.get('location')
        if location:
            qs = qs.filter(location__iexact=location)
        
        # Category filter
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__name=category)
        
        # Availability filter
        availability = self.request.query_params.get('availability')
        if availability == 'available':
            qs = qs.filter(availability_status='AVAILABLE')
        
        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            qs = qs.filter(price_per_day__gte=min_price)
        if max_price:
            qs = qs.filter(price_per_day__lte=max_price)
        
        return qs


class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'pk'
    permission_classes = [AllowAny]


# ==================== ITEM IMAGE APIs ====================

class ItemImageListCreateView(generics.ListCreateAPIView):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['uploaded_at']
    permission_classes = [AllowAny]


class ItemImageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    permission_classes = [AllowAny]


# ==================== WISHLIST APIs ====================

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


# ==================== MY ITEMS ====================

class MyItemsListView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(owner=self.request.user)
    
