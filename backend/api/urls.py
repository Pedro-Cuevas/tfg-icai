from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserHashViewSet

router = DefaultRouter() # Create a router. This will create all the urls for us automatically
router.register(r'hashes', UserHashViewSet) # Register the viewset with the router 

urlpatterns = [
    path('', include(router.urls)), # Include the router urls
]