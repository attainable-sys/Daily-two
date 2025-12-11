from django.db import models
import uuid


class Campaign(models.Model):
    """Monthly campaign model (e.g., 'January Campaign')."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'campaigns'
        ordering = ['-year', '-month']
        unique_together = ['month', 'year']

    def __str__(self):
        return self.name
