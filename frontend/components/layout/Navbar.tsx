'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-text-primary hover:text-accent transition">
            🎵 DAILY TWO
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <Link
                href={`/artist/${user.id}`}
                className="text-text-secondary hover:text-text-primary transition"
              >
                @{user.username}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
