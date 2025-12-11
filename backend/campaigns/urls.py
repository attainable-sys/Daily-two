from django.urls import path
from .views import CampaignListView, CampaignDetailView

urlpatterns = [
    path('', CampaignListView.as_view(), name='campaign_list'),
    path('<uuid:pk>/', CampaignDetailView.as_view(), name='campaign_detail'),
]
