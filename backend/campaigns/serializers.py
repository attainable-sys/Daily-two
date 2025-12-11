from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaign model."""
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ('id', 'name', 'month', 'year', 'created_at', 'track_count')
        read_only_fields = ('id', 'created_at')

    def get_track_count(self, obj):
        return obj.tracks.count()
