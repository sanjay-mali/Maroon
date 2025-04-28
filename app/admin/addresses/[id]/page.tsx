'use client'

import { getAddressById } from '@/lib/appwrite';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Address {
  id: string;
  userId: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}

export default function AddressDetailsPage() {
  const { id } = useParams();
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const addressData = await getAddressById(id as string);
      setAddress(addressData);
    };
    fetchAddress();
  }, [id]);

  return (
    <div>
      <h1>Address Details</h1>
      {address ? (
        <>
          <p>Address ID: {address.id}</p>
          <p>User ID: {address.userId}</p>
          <p>Country: {address.country}</p>
          <p>State: {address.state}</p>
          <p>City: {address.city}</p>
          <p>Street: {address.street}</p>
          <p>Zip Code: {address.zipCode}</p>
        </>
      ) : (
        <p>Address not found</p>
      )}
    </div>
  );
}