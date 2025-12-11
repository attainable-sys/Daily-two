from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Prefetch
from collections import defaultdict
from .models import Track
from .serializers import TrackSerializer, TrackUploadSerializer, TrackListSerializer
from campaigns.models import Campaign
from .tasks import transcode_audio_to_mp3


class TrackListView(generics.ListAPIView):
    """
    List all tracks grouped by upload date (reverse chronological).
    Returns tracks organized by day for the homepage view.
    """
    serializer_class = TrackListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Track.objects.select_related('user', 'campaign').prefetch_related('comments')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Group tracks by upload_date
        tracks_by_date = defaultdict(list)
        for track in queryset:
            tracks_by_date[track.upload_date].append(
                TrackListSerializer(track, context={'request': request}).data
            )

        # Convert to list of date groups (reverse chronological)
        date_groups = [
            {
                'date': date,
                'tracks': tracks
            }
            for date, tracks in sorted(tracks_by_date.items(), reverse=True)
        ]

        return Response(date_groups)


class TrackDetailView(generics.RetrieveDestroyAPIView):
    """Get or delete a specific track."""
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        # Only allow user to delete their own tracks or admins
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own tracks")
        instance.delete()


class TrackUploadView(generics.CreateAPIView):
    """Upload a new track."""
    serializer_class = TrackUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        uploaded_file = serializer.validated_data['file']

        # Get or create current month's campaign
        now = timezone.now()
        month_name = now.strftime('%B')  # e.g., "January"
        campaign_name = f"{month_name} Campaign"

        campaign, created = Campaign.objects.get_or_create(
            month=now.month,
            year=now.year,
            defaults={'name': campaign_name}
        )

        # Create track
        track = serializer.save(
            user=self.request.user,
            campaign=campaign,
            original_filename=uploaded_file.name,
            file_size_bytes=uploaded_file.size
        )

        # Trigger async transcoding task
        transcode_audio_to_mp3.delay(str(track.id))

        return track

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        track = self.perform_create(serializer)

        return Response(
            TrackSerializer(track, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class UserTracksView(generics.ListAPIView):
    """Get all tracks by a specific user (for artist pages)."""
    serializer_class = TrackListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Track.objects.filter(user_id=user_id).select_related('user', 'campaign').prefetch_related('comments')
