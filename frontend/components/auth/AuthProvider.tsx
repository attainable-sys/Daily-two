'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { authAPI } from '@/lib/api';

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, setIsAuthenticated, setIsLoading, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);

      if (!PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      }
      return;
    }

    try {
      const user = await authAPI.getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      if (!PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading on protected routes
  if (isLoading && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Redirect to home if accessing login/register while authenticated
  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
