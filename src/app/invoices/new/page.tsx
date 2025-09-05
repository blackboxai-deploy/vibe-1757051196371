"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvoiceForm } from '@/components/invoices/invoice-form';
import { saveInvoice, loadInvoices, loadClients } from '@/lib/storage';
import { generateInvoiceNumber } from '@/lib/invoice-utils';
import { InvoiceFormData, Invoice } from '@/types';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true);
    
    try {
      const existingInvoices = loadInvoices();
      const clients = loadClients();
      const client = clients.find(c => c.id === data.clientId);
      
      if (!client) {
        alert('Selected client not found. Please refresh and try again.');
        return;
      }

      // Calculate invoice totals
      const items = data.items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        taxRate: item.taxRate,
        amount: item.quantity * item.rate,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = items.reduce((sum, item) => sum + (item.amount * item.taxRate / 100), 0);
      const discountAmount = data.discountType === 'percentage' 
        ? (subtotal * data.discountValue) / 100 
        : data.discountValue;
      const total = subtotal + taxAmount - discountAmount;

      const invoice: Invoice = {
        id: `invoice-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(existingInvoices),
        clientId: data.clientId,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        status: 'draft',
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        discountType: data.discountType,
        discountValue: data.discountValue,
        total: Math.round(total * 100) / 100,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        terms: data.terms,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveInvoice(invoice);
      
      // Redirect to invoice view
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/invoices');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="text-gray-600 mt-2">
          Fill out the form below to create a new invoice for your client.
        </p>
      </div>
      
      <InvoiceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}