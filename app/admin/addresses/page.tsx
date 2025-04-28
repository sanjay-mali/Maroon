'use client';
import { getAllAddresses } from '@/lib/appwrite';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

export default function AddressesPage(): JSX.Element {
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const data = await getAllAddresses();
      if (data) {
        setAddresses(data);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <div>
      <h1>Addresses</h1>
      {addresses.length > 0 ? (
        <ul>
          {addresses.map((address) => (
            <li key={address.$id}>
              {address.$id}
              <Link href={`/admin/addresses/${address.$id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses found.</p>
      )}
    </div>
  );
}