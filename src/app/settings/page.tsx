"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { businessProfileSchema } from '@/lib/validators';
import { loadBusinessProfile, saveBusinessProfile, getDefaultBusinessProfile } from '@/lib/storage';
import { BusinessProfile } from '@/types';
import { BusinessProfileData } from '@/lib/validators';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BusinessProfileData>({
    resolver: zodResolver(businessProfileSchema),
  });

  useEffect(() => {
    // Load existing business profile or use defaults
    const profile = loadBusinessProfile() || getDefaultBusinessProfile();
    
    setValue('companyName', profile.companyName);
    setValue('ownerName', profile.ownerName);
    setValue('email', profile.email);
    setValue('phone', profile.phone);
    setValue('website', profile.website || '');
    setValue('address.street', profile.address.street);
    setValue('address.city', profile.address.city);
    setValue('address.state', profile.address.state);
    setValue('address.zipCode', profile.address.zipCode);
    setValue('address.country', profile.address.country);
    setValue('taxNumber', profile.taxNumber || '');
    setValue('currency', profile.currency);
    setValue('defaultTaxRate', profile.defaultTaxRate);
    setValue('paymentTerms', profile.paymentTerms);
    setValue('invoiceTerms', profile.invoiceTerms);
  }, [setValue]);

  const onSubmit = async (data: BusinessProfileData) => {
    setIsLoading(true);
    setIsSaved(false);
    
    try {
      const existingProfile = loadBusinessProfile();
      const now = new Date();
      
      const profile: BusinessProfile = {
        id: existingProfile?.id || 'default-business-profile',
        companyName: data.companyName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        website: data.website,
        logo: existingProfile?.logo || '',
        address: data.address,
        taxNumber: data.taxNumber,
        currency: data.currency,
        currencySymbol: getCurrencySymbol(data.currency),
        defaultTaxRate: data.defaultTaxRate,
        paymentTerms: data.paymentTerms,
        invoiceTerms: data.invoiceTerms,
        createdAt: existingProfile?.createdAt || now,
        updatedAt: now,
      };

      saveBusinessProfile(profile);
      setIsSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving business profile:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
    };
    return symbols[currency] || '$';
  };

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
  ];

  const paymentTermsOptions = [
    { value: 'due_on_receipt', label: 'Due on Receipt' },
    { value: '7', label: 'Net 7' },
    { value: '14', label: 'Net 14' },
    { value: '30', label: 'Net 30' },
    { value: '60', label: 'Net 60' },
    { value: '90', label: 'Net 90' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your business profile and invoice preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  {...register('companyName')}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  {...register('ownerName')}
                  placeholder="Your Full Name"
                />
                {errors.ownerName && (
                  <p className="text-sm text-red-500 mt-1">{errors.ownerName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="contact@yourcompany.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  type="url"
                  {...register('website')}
                  placeholder="https://yourcompany.com"
                />
                {errors.website && (
                  <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  {...register('taxNumber')}
                  placeholder="123-45-6789"
                />
                {errors.taxNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.taxNumber.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Address</CardTitle>
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

        {/* Invoice Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Currency</Label>
                <Select onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register('defaultTaxRate', { valueAsNumber: true })}
                  placeholder="8.25"
                />
                {errors.defaultTaxRate && (
                  <p className="text-sm text-red-500 mt-1">{errors.defaultTaxRate.message}</p>
                )}
              </div>

              <div>
                <Label>Default Payment Terms</Label>
                <Select onValueChange={(value) => setValue('paymentTerms', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentTerms && (
                  <p className="text-sm text-red-500 mt-1">{errors.paymentTerms.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="invoiceTerms">Default Invoice Terms</Label>
              <Textarea
                {...register('invoiceTerms')}
                placeholder="Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge."
                className="min-h-[100px]"
              />
              {errors.invoiceTerms && (
                <p className="text-sm text-red-500 mt-1">{errors.invoiceTerms.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end space-x-4">
          {isSaved && (
            <div className="flex items-center text-green-600">
              <span className="mr-2">✅</span>
              Settings saved successfully!
            </div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <span className="mr-2">⏳</span>}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}