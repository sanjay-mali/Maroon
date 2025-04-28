'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './ui/use-toast';
import { createUser } from '@/lib/appwrite';

export default function UserRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)

    try {
      await createUser(email, password, name);
      toast({ title: 'Success', description: 'User created successfully' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="block mb-1">
          Name
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="block mb-1">
          Email
        </Label>
        <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
          required
        />
      </div>
      <div>
        <Label htmlFor="password" className="block mb-1">
          Password
        </Label>
        <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary-light"
        disabled={isLoading}
      >
        Register
      </button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );