from django.db import models
from django.conf import settings
import uuid
import os


def track_upload_path(instance, filename):
    """Generate upload path for tracks."""
    # Organize by user and date
    date_path = instance.uploaded_at.strftime('%Y/%m/%d')
    ext = os.path.splitext(filename)[1]
    new_filename = f"{instance.id}{ext}"
    return f"tracks/{instance.user.id}/{date_path}/{new_filename}"


class Track(models.Model):
    """Audio track model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tracks'
    )
    campaign = models.ForeignKey(
        'campaigns.Campaign',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tracks'
    )
    title = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255)

    # File storage
    file = models.FileField(upload_to=track_upload_path)

    # Metadata
    duration_seconds = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    file_size_bytes = models.BigIntegerField()

    # Timestamps
    upload_date = models.DateField(auto_now_add=True, db_index=True)
    uploaded_at = models.DateTimeField(auto_now_add=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Processing status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    class Meta:
        db_table = 'tracks'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['-uploaded_at']),
            models.Index(fields=['upload_date', '-uploaded_at']),
            models.Index(fields=['user', '-uploaded_at']),
        ]

    def __str__(self):
        return f"{self.title} by {self.user.username}"

    def delete(self, *args, **kwargs):
        """Delete track file when model is deleted."""
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)
