from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'month', 'year', 'created_at')
    list_filter = ('year', 'month')
    search_fields = ('name',)
    ordering = ('-year', '-month')
