'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const [invitationToken, setInvitationToken] = useState('');
  const [invitationEmail, setInvitationEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setInvitationToken(token);
      validateToken(token);
    }
  }, [searchParams]);

  const validateToken = async (token: string) => {
    setIsValidating(true);
    try {
      const response = await authAPI.validateInvitation(token);
      if (response.valid && response.email) {
        setInvitationEmail(response.email);
        setEmail(response.email);
      } else {
        setError('Invalid or expired invitation token');
      }
    } catch (err) {
      setError('Invalid or expired invitation token');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.register({
        username,
        email,
        password,
        invitation_token: invitationToken,
      });
      login(response.user, response.tokens.access, response.tokens.refresh);
      router.push('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-text-primary mb-4">🎵 DAILY TWO</h1>
          <p className="text-text-secondary text-lg">Create Your Account</p>
        </div>

        {/* Register Form */}
        <div className="bg-surface rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Register</h2>

          {isValidating ? (
            <div className="text-center py-8 text-text-secondary">Validating invitation...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invitation Token */}
              <div>
                <label className="block text-text-primary mb-2 font-medium">Invitation Token</label>
                <input
                  type="text"
                  value={invitationToken}
                  onChange={(e) => setInvitationToken(e.target.value)}
                  placeholder="Enter invitation token"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
                  required
                  disabled={isLoading}
                />
                {invitationEmail && (
                  <p className="text-success text-sm mt-1">✓ Valid for: {invitationEmail}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-text-primary mb-2 font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-text-primary mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-text-primary mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <p className="text-text-secondary text-sm mt-1">Min 8 characters</p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-error bg-opacity-10 border border-error rounded-lg">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Login here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
