from django.urls import path
from .views import TrackCommentsView, CommentDetailView

urlpatterns = [
    path('track/<uuid:track_id>/', TrackCommentsView.as_view(), name='track_comments'),
    path('<uuid:pk>/', CommentDetailView.as_view(), name='comment_detail'),
]
