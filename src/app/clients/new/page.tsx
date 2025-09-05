"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientForm } from '@/components/clients/client-form';
import { saveClient } from '@/lib/storage';
import { ClientFormData, Client } from '@/types';

export default function NewClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    
    try {
      const client: Client = {
        id: `client-${Date.now()}`,
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        address: data.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveClient(client);
      
      // Redirect to clients list
      router.push('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/clients');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-600 mt-2">
          Add a new client to your database for invoice creation.
        </p>
      </div>
      
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}