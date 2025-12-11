"""
URL configuration for Daily Two project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include('users.urls')),
    path('api/tracks/', include('tracks.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/campaigns/', include('campaigns.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
