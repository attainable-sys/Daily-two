from rest_framework import serializers
from .models import Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = (
            'id', 'track', 'user', 'username', 'timestamp_seconds',
            'comment_text', 'created_at'
        )
        read_only_fields = ('id', 'user', 'created_at')

    def validate_timestamp_seconds(self, value):
        if value < 0:
            raise serializers.ValidationError("Timestamp cannot be negative")
        return value


class CreateCommentSerializer(serializers.ModelSerializer):
    """Serializer for creating comments."""

    class Meta:
        model = Comment
        fields = ('track', 'timestamp_seconds', 'comment_text')

    def validate_timestamp_seconds(self, value):
        if value < 0:
            raise serializers.ValidationError("Timestamp cannot be negative")
        return value
