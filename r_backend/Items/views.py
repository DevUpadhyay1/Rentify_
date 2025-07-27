from django.shortcuts import render

# Create your views here.
# views.py

from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import Category
from .serializers import CategorySerializer
from .permissions import IsAdminOrReadOnlyApproval

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnlyApproval]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        # Show only approved categories to normal users
        user = self.request.user
        if user.is_staff:
            return Category.objects.all()
        return Category.objects.filter(is_approved=True)

class CategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnlyApproval]
