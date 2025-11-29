'use client';

import { signIn } from '@/app/login/loginAction';
import BaseInput from '@/components/base-input';
import BrandButton from '@/components/brand-button';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
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
        router.push('/');
        router.refresh();
      }
    } catch {
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
            <BaseInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="mail@google.com"
            />

            <BaseInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />

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
