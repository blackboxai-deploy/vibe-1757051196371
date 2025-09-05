"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clientFormSchema } from '@/lib/validators';
import { Client, ClientFormData } from '@/types';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, onCancel, isLoading = false }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || '',
      company: client?.company || '',
      email: client?.email || '',
      phone: client?.phone || '',
      address: {
        street: client?.address.street || '',
        city: client?.address.city || '',
        state: client?.address.state || '',
        zipCode: client?.address.zipCode || '',
        country: client?.address.country || 'United States',
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Contact Name *</Label>
              <Input
                {...register('name')}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                {...register('company')}
                placeholder="Acme Corporation"
              />
              {errors.company && (
                <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                type="email"
                {...register('email')}
                placeholder="john@acme.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address.street">Street Address *</Label>
            <Input
              {...register('address.street')}
              placeholder="123 Business Street"
            />
            {errors.address?.street && (
              <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="address.city">City *</Label>
              <Input
                {...register('address.city')}
                placeholder="Business City"
              />
              {errors.address?.city && (
                <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address.state">State *</Label>
              <Input
                {...register('address.state')}
                placeholder="CA"
              />
              {errors.address?.state && (
                <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address.zipCode">ZIP Code *</Label>
              <Input
                {...register('address.zipCode')}
                placeholder="12345"
              />
              {errors.address?.zipCode && (
                <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address.country">Country *</Label>
              <Input
                {...register('address.country')}
                placeholder="United States"
              />
              {errors.address?.country && (
                <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <span className="mr-2">⏳</span>}
          {client ? 'Update Client' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
}