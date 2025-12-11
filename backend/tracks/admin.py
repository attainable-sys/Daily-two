from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'campaign', 'status', 'duration_seconds', 'uploaded_at')
    list_filter = ('status', 'upload_date', 'campaign')
    search_fields = ('title', 'user__username', 'original_filename')
    readonly_fields = ('id', 'uploaded_at', 'upload_date', 'created_at')
    ordering = ('-uploaded_at',)

    fieldsets = (
        ('Track Info', {
            'fields': ('id', 'user', 'campaign', 'title', 'original_filename')
        }),
        ('File Info', {
            'fields': ('file', 'duration_seconds', 'file_size_bytes', 'status')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at', 'upload_date', 'created_at')
        }),
    )
