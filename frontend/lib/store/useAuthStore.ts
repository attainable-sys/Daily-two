import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user }),

  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

  setIsLoading: (isLoading) => set({ isLoading }),

  login: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    set({ user: null, isAuthenticated: false });
  },
}));
