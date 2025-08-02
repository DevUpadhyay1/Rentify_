# views.py
from rest_framework import generics, filters, permissions
from .models import Category, Item, ItemImage, ItemReview,Wishlist
from .serializers import CategorySerializer, ItemSerializer, ItemImageSerializer, ItemReviewSerializer, WishlistSerializer
from rest_framework.pagination import PageNumberPagination

# class StandardPagination(PageNumberPagination):
#     page_size = 10
#     page_size_query_param = 'page_size'



class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']


class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'name'


class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'price', 'name']


class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'name'


class ItemImageListCreateView(generics.ListCreateAPIView):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    # pagination_class = StandardPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['uploaded_at']


class ItemImageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer

class ItemReviewListCreateView(generics.ListCreateAPIView):
    queryset = ItemReview.objects.all()
    serializer_class = ItemReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistListCreateView(generics.ListCreateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)