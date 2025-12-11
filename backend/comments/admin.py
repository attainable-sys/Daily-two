from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('track', 'user', 'timestamp_seconds', 'comment_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('comment_text', 'user__username', 'track__title')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def comment_preview(self, obj):
        return obj.comment_text[:50] + '...' if len(obj.comment_text) > 50 else obj.comment_text
    comment_preview.short_description = 'Comment'
