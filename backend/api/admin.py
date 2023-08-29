from django.contrib import admin
from .models import UserHash

@admin.register(UserHash)
class HashAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'hash_value', 'description')