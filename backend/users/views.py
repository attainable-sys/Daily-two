from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .models import User, Invitation
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
    InvitationSerializer,
    CreateInvitationSerializer
)


class RegisterView(generics.CreateAPIView):
    """User registration with invitation token."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """User login."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class CurrentUserView(generics.RetrieveAPIView):
    """Get current authenticated user."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    """Get user details by ID."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class CreateInvitationView(generics.CreateAPIView):
    """Create and send invitation (admin only)."""
    serializer_class = CreateInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check if user is admin
        if not self.request.user.is_admin and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Only admins can send invitations")

        email = serializer.validated_data['email']

        # Create invitation
        invitation = Invitation.objects.create(
            email=email,
            invited_by=self.request.user
        )

        # Send invitation email
        registration_url = f"{settings.FRONTEND_URL}/register?token={invitation.token}"

        send_mail(
            subject='You\'re invited to Daily Two!',
            message=f'''
You've been invited to join Daily Two, a collaborative music sharing platform.

Click the link below to create your account:
{registration_url}

This invitation will expire in 7 days.

Welcome aboard!
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return invitation

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invitation = self.perform_create(serializer)

        return Response(
            InvitationSerializer(invitation).data,
            status=status.HTTP_201_CREATED
        )


class InvitationListView(generics.ListAPIView):
    """List all invitations (admin only)."""
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check if user is admin
        if not self.request.user.is_admin and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Only admins can view invitations")

        return Invitation.objects.all()


class ValidateInvitationView(APIView):
    """Validate an invitation token."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token)
            if invitation.is_valid():
                return Response({
                    'valid': True,
                    'email': invitation.email
                })
            else:
                return Response({
                    'valid': False,
                    'message': 'Invitation is expired or already used'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Invitation.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Invalid invitation token'
            }, status=status.HTTP_404_NOT_FOUND)
