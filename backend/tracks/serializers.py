from rest_framework import serializers
from .models import Track
from users.serializers import UserSerializer
from campaigns.serializers import CampaignSerializer


class TrackSerializer(serializers.ModelSerializer):
    """Serializer for Track model."""
    user = UserSerializer(read_only=True)
    campaign = CampaignSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = (
            'id', 'user', 'campaign', 'title', 'original_filename',
            'file', 'file_url', 'duration_seconds', 'file_size_bytes',
            'upload_date', 'uploaded_at', 'status', 'comment_count'
        )
        read_only_fields = (
            'id', 'user', 'campaign', 'duration_seconds',
            'file_size_bytes', 'upload_date', 'uploaded_at', 'status'
        )

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()


class TrackUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading tracks."""
    file = serializers.FileField()

    class Meta:
        model = Track
        fields = ('title', 'file')

    def validate_file(self, value):
        # Validate file size (20MB max)
        max_size = 20 * 1024 * 1024  # 20MB in bytes
        if value.size > max_size:
            raise serializers.ValidationError("File size cannot exceed 20MB")

        # Validate file extension (audio files only)
        allowed_extensions = [
            '.mp3', '.wav', '.flac', '.m4a', '.aac',
            '.ogg', '.wma', '.aiff', '.ape'
        ]
        file_ext = value.name.lower()[value.name.rfind('.'):]
        if file_ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )

        return value


class TrackListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing tracks."""
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    file_url = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = (
            'id', 'user_id', 'username', 'campaign_name', 'title',
            'file_url', 'duration_seconds', 'upload_date',
            'uploaded_at', 'status', 'comment_count'
        )

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()
