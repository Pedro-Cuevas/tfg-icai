from rest_framework import viewsets
from .models import UserHash
from .serializers import UserHashSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class UserHashViewSet(viewsets.ModelViewSet):
    serializer_class = UserHashSerializer  # Use the serializer we created
    authentication_classes = [JWTAuthentication]  # Use JWT for authentication
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    queryset = UserHash.objects.all()  # Get all the hashes

    def get_queryset(self):
        return UserHash.objects.filter(
            user=self.request.user
        )  # Get only the hashes for the current user

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )  # Save the user when creating a new hash
