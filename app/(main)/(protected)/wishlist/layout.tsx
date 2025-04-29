'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authStatus) router.push('/login');
  }, [authStatus, router]);

  if (!authStatus) return null;
  return <>{children}</>;
}