import { Invoice, InvoiceItem, InvoiceStatus, PaymentTerms } from '@/types';

// Invoice calculation utilities
export const calculateItemAmount = (item: Partial<InvoiceItem>): number => {
  const quantity = item.quantity || 0;
  const rate = item.rate || 0;
  return quantity * rate;
};

export const calculateItemTax = (item: Partial<InvoiceItem>): number => {
  const amount = calculateItemAmount(item);
  const taxRate = (item.taxRate || 0) / 100;
  return amount * taxRate;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => total + calculateItemAmount(item), 0);
};

export const calculateTotalTax = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTax(item), 0);
};

export const calculateDiscountAmount = (
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number => {
  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100;
  }
  return discountValue;
};

export const calculateInvoiceTotal = (
  items: InvoiceItem[],
  discountType: 'percentage' | 'fixed' = 'fixed',
  discountValue: number = 0
): { subtotal: number; taxAmount: number; discountAmount: number; total: number } => {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTotalTax(items);
  const discountAmount = calculateDiscountAmount(subtotal, discountType, discountValue);
  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

// Date utilities
export const calculateDueDate = (issueDate: Date, paymentTerms: PaymentTerms): Date => {
  const dueDate = new Date(issueDate);
  
  switch (paymentTerms) {
    case 'due_on_receipt':
      return dueDate;
    case '7':
      dueDate.setDate(dueDate.getDate() + 7);
      break;
    case '14':
      dueDate.setDate(dueDate.getDate() + 14);
      break;
    case '30':
      dueDate.setDate(dueDate.getDate() + 30);
      break;
    case '60':
      dueDate.setDate(dueDate.getDate() + 60);
      break;
    case '90':
      dueDate.setDate(dueDate.getDate() + 90);
      break;
    default:
      dueDate.setDate(dueDate.getDate() + 30);
  }
  
  return dueDate;
};

export const isInvoiceOverdue = (invoice: Invoice): boolean => {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') {
    return false;
  }
  return new Date() > new Date(invoice.dueDate);
};

export const getDaysOverdue = (dueDate: Date): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Invoice number generation
export const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const year = new Date().getFullYear();
  const existingNumbers = existingInvoices
    .map(inv => inv.invoiceNumber)
    .filter(num => num.startsWith(`INV-${year}-`))
    .map(num => parseInt(num.split('-')[2]) || 0)
    .sort((a, b) => b - a);
  
  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
  return `INV-${year}-${nextNumber.toString().padStart(4, '0')}`;
};

// Formatting utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

// Status utilities
export const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'sent':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusLabel = (status: InvoiceStatus): string => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'sent':
      return 'Sent';
    case 'paid':
      return 'Paid';
    case 'overdue':
      return 'Overdue';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const getPaymentTermsLabel = (terms: PaymentTerms): string => {
  switch (terms) {
    case 'due_on_receipt':
      return 'Due on Receipt';
    case '7':
      return 'Net 7';
    case '14':
      return 'Net 14';
    case '30':
      return 'Net 30';
    case '60':
      return 'Net 60';
    case '90':
      return 'Net 90';
    default:
      return 'Net 30';
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone.trim());
};

export const validateInvoiceItem = (item: Partial<InvoiceItem>): string[] => {
  const errors: string[] = [];
  
  if (!item.description || item.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!item.quantity || item.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (!item.rate || item.rate <= 0) {
    errors.push('Rate must be greater than 0');
  }
  
  if (item.taxRate !== undefined && (item.taxRate < 0 || item.taxRate > 100)) {
    errors.push('Tax rate must be between 0 and 100');
  }
  
  return errors;
};