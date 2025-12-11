from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer, CreateCommentSerializer


class TrackCommentsView(generics.ListCreateAPIView):
    """List or create comments for a specific track."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateCommentSerializer
        return CommentSerializer

    def get_queryset(self):
        track_id = self.kwargs['track_id']
        return Comment.objects.filter(track_id=track_id).select_related('user', 'track')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentDetailView(generics.RetrieveDestroyAPIView):
    """Get or delete a specific comment."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        # Only allow user to delete their own comments or admins
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own comments")
        instance.delete()
