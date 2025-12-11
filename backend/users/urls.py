from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    UserDetailView,
    CreateInvitationView,
    InvitationListView,
    ValidateInvitationView
)

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),

    # Users
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Invitations
    path('invitations/', CreateInvitationView.as_view(), name='create_invitation'),
    path('invitations/list/', InvitationListView.as_view(), name='invitation_list'),
    path('invitations/validate/<uuid:token>/', ValidateInvitationView.as_view(), name='validate_invitation'),
]
