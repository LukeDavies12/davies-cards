'use client';

import { signIn } from '@/app/login/loginAction';
import BrandButton from '@/components/brand-button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[600px] flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-2 py-1 text-sm border-b border-neutral-300 focus:outline-none focus:border-neutral-900"
                placeholder="mail@google.com"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-2 py-1 text-sm border-b border-neutral-300 focus:outline-none focus:border-neutral-900"
                placeholder="********"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <BrandButton type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </BrandButton>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-[50%] relative mt-8">
        <Image
          src="/login.avif"
          alt="Login"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

