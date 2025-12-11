from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Invitation


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_admin', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration with invitation token."""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    invitation_token = serializers.UUIDField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_invitation_token(self, value):
        try:
            invitation = Invitation.objects.get(token=value)
            if not invitation.is_valid():
                raise serializers.ValidationError("Invitation is invalid or expired")
            return value
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation token")

    def create(self, validated_data):
        invitation_token = validated_data.pop('invitation_token')
        invitation = Invitation.objects.get(token=invitation_token)

        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Mark invitation as used
        invitation.used = True
        invitation.used_by = user
        invitation.save()

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError("Must include username and password")


class InvitationSerializer(serializers.ModelSerializer):
    """Serializer for Invitation model."""
    invited_by_username = serializers.CharField(source='invited_by.username', read_only=True)
    used_by_username = serializers.CharField(source='used_by.username', read_only=True)
    is_valid = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = (
            'id', 'email', 'token', 'invited_by', 'invited_by_username',
            'used', 'used_by', 'used_by_username', 'created_at',
            'expires_at', 'is_valid'
        )
        read_only_fields = ('id', 'token', 'invited_by', 'used', 'used_by', 'created_at')

    def get_is_valid(self, obj):
        return obj.is_valid()


class CreateInvitationSerializer(serializers.Serializer):
    """Serializer for creating new invitations."""
    email = serializers.EmailField()

    def validate_email(self, value):
        # Check if user already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")

        # Check if there's already a pending invitation
        existing = Invitation.objects.filter(email=value, used=False).first()
        if existing and existing.is_valid():
            raise serializers.ValidationError("Active invitation already exists for this email")

        return value
