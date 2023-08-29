from rest_framework import serializers
from .models import UserHash
from djoser.serializers import UserCreateSerializer


class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = ("id", "email", "username", "first_name", "last_name", "password")


class UserHashSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHash
        fields = "__all__"
        read_only_fields = (
            "user",
        )  # Exclude 'user' from required fields during creation
