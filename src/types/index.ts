// Core application types and interfaces

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentTerms = '7' | '14' | '30' | '60' | '90' | 'due_on_receipt';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client; // Populated client data
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  total: number;
  notes?: string;
  terms?: string;
  paymentTerms: PaymentTerms;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxNumber?: string;
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number;
  paymentTerms: PaymentTerms;
  invoiceTerms: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  overdueAmount: number;
  averageInvoiceValue: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

// Form types for validation
export interface InvoiceFormData {
  clientId: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  items: {
    description: string;
    quantity: number;
    rate: number;
    taxRate: number;
  }[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  notes: string;
  terms: string;
}

export interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface BusinessProfileFormData {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxNumber: string;
  currency: string;
  defaultTaxRate: number;
  paymentTerms: PaymentTerms;
  invoiceTerms: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}