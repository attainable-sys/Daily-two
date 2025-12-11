import apiClient from './client';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  DailyTracksGroup,
  Track,
  TrackListItem,
  Comment,
  CreateCommentData,
  Campaign,
} from '@/types';

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register/', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  },

  validateInvitation: async (token: string): Promise<{ valid: boolean; email?: string }> => {
    const response = await apiClient.get(`/invitations/validate/${token}/`);
    return response.data;
  },
};

// Tracks API
export const tracksAPI = {
  getAll: async (): Promise<DailyTracksGroup[]> => {
    const response = await apiClient.get('/tracks/');
    return response.data;
  },

  getById: async (id: string): Promise<Track> => {
    const response = await apiClient.get(`/tracks/${id}/`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<TrackListItem[]> => {
    const response = await apiClient.get(`/tracks/user/${userId}/`);
    return response.data;
  },

  upload: async (title: string, file: File): Promise<Track> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const response = await apiClient.post('/tracks/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tracks/${id}/`);
  },
};

// Comments API
export const commentsAPI = {
  getByTrack: async (trackId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/track/${trackId}/`);
    return response.data;
  },

  create: async (data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post(`/comments/track/${data.track}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}/`);
  },
};

// Campaigns API
export const campaignsAPI = {
  getAll: async (): Promise<Campaign[]> => {
    const response = await apiClient.get('/campaigns/');
    return response.data;
  },

  getById: async (id: string): Promise<Campaign> => {
    const response = await apiClient.get(`/campaigns/${id}/`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}/`);
    return response.data;
  },
};
