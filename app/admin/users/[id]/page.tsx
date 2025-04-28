'use client';

import { getUserById, blockUser, unblockUser } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User extends Models.Document {
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(id);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [id]);

  const handleBlock = async () => {
    if (!user) return;
    const success = await blockUser(user.$id);
    if (success) {
      setUser({...user, isActive: false})
      toast({ description: 'User blocked successfully' });
    } else {
      toast({ variant: 'destructive', description: 'Error blocking user' });
    }
  };
  
  const handleUnblock = async () => {
    if (!user) return;
    const success = await unblockUser(user.$id);
    if (success) {
      setUser({...user, isActive: true})
      toast({ description: 'User unblocked successfully' });
    } else {
      toast({ variant: 'destructive', description: 'Error unblocking user' });
    }
  };

  return (
    <div>
      <h1>User Details</h1>
      <p>User ID: {user ? user.$id : id}</p>
      {user ? (
        <>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Created At: {user.createdAt}</p>
          <p>Updated At: {user.updatedAt}</p>
          {user.isActive ? (
            <button onClick={handleBlock}>Block User</button>
          ) : (
            <button onClick={handleUnblock}>Unblock User</button>
          )}
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}