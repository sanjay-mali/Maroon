'use client';

import { getAllUsers } from '@/lib/appwrite';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UsersPage () {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.$id}>
            <p>ID: {user.$id}</p>
            <p>Email: {user.email}</p>
            <Link href={`/admin/users/${user.$id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}