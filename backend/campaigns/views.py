from rest_framework import generics, permissions
from .models import Campaign
from .serializers import CampaignSerializer


class CampaignListView(generics.ListAPIView):
    """List all campaigns."""
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]


class CampaignDetailView(generics.RetrieveAPIView):
    """Get campaign details."""
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
