import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { NowPlaying } from '@/components/player/NowPlaying';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Daily Two - Collaborative Music Player',
  description: 'A collaborative music sharing platform with daily uploads and timestamp comments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pb-24">{children}</main>
            <NowPlaying />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
