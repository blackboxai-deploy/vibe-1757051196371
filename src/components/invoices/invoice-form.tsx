"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { loadClients, loadBusinessProfile, getDefaultBusinessProfile } from '@/lib/storage';
import { calculateInvoiceTotal, calculateDueDate, formatCurrency } from '@/lib/invoice-utils';
import { invoiceFormSchema } from '@/lib/validators';
import { Invoice, InvoiceFormData, Client, BusinessProfile, PaymentTerms } from '@/types';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InvoiceForm({ invoice, onSubmit, onCancel, isLoading = false }: InvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [preview, setPreview] = useState({ subtotal: 0, taxAmount: 0, discountAmount: 0, total: 0 });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: invoice?.clientId || '',
      issueDate: invoice?.issueDate ? invoice.issueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      dueDate: invoice?.dueDate ? invoice.dueDate.toISOString().split('T')[0] : '',
      paymentTerms: invoice?.paymentTerms || '30',
      items: invoice?.items?.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        taxRate: item.taxRate,
      })) || [{ description: '', quantity: 1, rate: 0, taxRate: 8.25 }],
      discountType: invoice?.discountType || 'fixed',
      discountValue: invoice?.discountValue || 0,
      notes: invoice?.notes || '',
      terms: invoice?.terms || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedFields = watch();

  useEffect(() => {
    // Load clients and business profile
    const clientsData = loadClients();
    const profile = loadBusinessProfile() || getDefaultBusinessProfile();
    
    setClients(clientsData);
    setBusinessProfile(profile);
    
    // Set default terms if not editing existing invoice
    if (!invoice && profile.invoiceTerms) {
      setValue('terms', profile.invoiceTerms);
    }
  }, [invoice, setValue]);

  useEffect(() => {
    // Auto-calculate due date when issue date or payment terms change
    if (watchedFields.issueDate && watchedFields.paymentTerms) {
      const issueDate = new Date(watchedFields.issueDate);
      const dueDate = calculateDueDate(issueDate, watchedFields.paymentTerms as PaymentTerms);
      setValue('dueDate', dueDate.toISOString().split('T')[0]);
    }
  }, [watchedFields.issueDate, watchedFields.paymentTerms, setValue]);

  useEffect(() => {
    // Calculate invoice totals
    if (watchedFields.items) {
      const items = watchedFields.items.map(item => ({
        id: '',
        description: item.description || '',
        quantity: Number(item.quantity) || 0,
        rate: Number(item.rate) || 0,
        taxRate: Number(item.taxRate) || 0,
        amount: 0,
      }));

      const totals = calculateInvoiceTotal(
        items,
        watchedFields.discountType,
        Number(watchedFields.discountValue) || 0
      );

      setPreview(totals);
    }
  }, [watchedFields.items, watchedFields.discountType, watchedFields.discountValue]);

  const handleAddItem = () => {
    const defaultTaxRate = businessProfile?.defaultTaxRate || 8.25;
    append({ description: '', quantity: 1, rate: 0, taxRate: defaultTaxRate });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const paymentTermsOptions = [
    { value: 'due_on_receipt', label: 'Due on Receipt' },
    { value: '7', label: 'Net 7' },
    { value: '14', label: 'Net 14' },
    { value: '30', label: 'Net 30' },
    { value: '60', label: 'Net 60' },
    { value: '90', label: 'Net 90' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId">Client *</Label>
              <Select onValueChange={(value) => setValue('clientId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company} - {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-500 mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select onValueChange={(value) => setValue('paymentTerms', value as PaymentTerms)}>
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

            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                type="date"
                {...register('issueDate')}
              />
              {errors.issueDate && (
                <p className="text-sm text-red-500 mt-1">{errors.issueDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                {...register('dueDate')}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Invoice Items</CardTitle>
          <Button type="button" onClick={handleAddItem} size="sm">
            <span className="mr-2">➕</span>
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Rate</TableHead>
                  <TableHead className="w-[100px]">Tax %</TableHead>
                  <TableHead className="w-[120px] text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const item = watchedFields.items?.[index];
                  const amount = (item?.quantity || 0) * (item?.rate || 0);
                  
                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Textarea
                          {...register(`items.${index}.description`)}
                          placeholder="Item description"
                          className="min-h-[60px] resize-none"
                        />
                        {errors.items?.[index]?.description && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.items[index]?.description?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.items[index]?.quantity?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`items.${index}.rate`, { valueAsNumber: true })}
                        />
                        {errors.items?.[index]?.rate && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.items[index]?.rate?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
                        />
                        {errors.items?.[index]?.taxRate && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.items[index]?.taxRate?.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(amount)}
                      </TableCell>
                      <TableCell>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Discount and totals */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Discount Type</Label>
              <Select onValueChange={(value) => setValue('discountType', value as 'percentage' | 'fixed')}>
                <SelectTrigger>
                  <SelectValue placeholder="Discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register('discountValue', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500 mt-1">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          {/* Invoice totals */}
          <div className="border-t pt-4">
            <div className="space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(preview.subtotal)}</span>
              </div>
              {preview.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(preview.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(preview.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(preview.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and terms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Add any additional notes for your client"
              className="min-h-[80px]"
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              {...register('terms')}
              placeholder="Payment terms and conditions"
              className="min-h-[100px]"
            />
            {errors.terms && (
              <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>
            )}
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
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}