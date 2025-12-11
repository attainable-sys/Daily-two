from django.urls import path
from .views import TrackListView, TrackDetailView, TrackUploadView, UserTracksView

urlpatterns = [
    path('', TrackListView.as_view(), name='track_list'),
    path('upload/', TrackUploadView.as_view(), name='track_upload'),
    path('<uuid:pk>/', TrackDetailView.as_view(), name='track_detail'),
    path('user/<uuid:user_id>/', UserTracksView.as_view(), name='user_tracks'),
]
