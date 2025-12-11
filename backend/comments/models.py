from django.db import models
from django.conf import settings
import uuid


class Comment(models.Model):
    """Timestamp-based comment model for tracks."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    track = models.ForeignKey(
        'tracks.Track',
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    timestamp_seconds = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Position in track where comment is made (in seconds)"
    )
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'
        ordering = ['timestamp_seconds', 'created_at']
        indexes = [
            models.Index(fields=['track', 'timestamp_seconds']),
            models.Index(fields=['track', 'created_at']),
        ]

    def __str__(self):
        return f"Comment by {self.user.username} at {self.timestamp_seconds}s on {self.track.title}"
