import { z } from 'zod';

// Common validation schemas
const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Invoice item validation schema
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .number()
    .min(0.01, 'Quantity must be greater than 0')
    .max(999999, 'Quantity is too large'),
  rate: z
    .number()
    .min(0.01, 'Rate must be greater than 0')
    .max(999999, 'Rate is too large'),
  taxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
});

// Invoice form validation schema
export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  paymentTerms: z.enum(['7', '14', '30', '60', '90', 'due_on_receipt']),
  items: z
    .array(invoiceItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items allowed'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(999999, 'Discount is too large'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters'),
  terms: z.string().max(2000, 'Terms cannot exceed 2000 characters'),
}).refine((data) => {
  // Validate due date is not before issue date
  const issueDate = new Date(data.issueDate);
  const dueDate = new Date(data.dueDate);
  return dueDate >= issueDate;
}, {
  message: 'Due date cannot be before issue date',
  path: ['dueDate'],
}).refine((data) => {
  // Validate percentage discount doesn't exceed 100%
  if (data.discountType === 'percentage') {
    return data.discountValue <= 100;
  }
  return true;
}, {
  message: 'Percentage discount cannot exceed 100%',
  path: ['discountValue'],
});

// Client form validation schema
export const clientFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name cannot exceed 200 characters'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  address: addressSchema,
});

// Business profile validation schema
export const businessProfileSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name cannot exceed 200 characters'),
  ownerName: z
    .string()
    .min(1, 'Owner name is required')
    .max(100, 'Owner name cannot exceed 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  website: z
    .string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  address: addressSchema,
  taxNumber: z
    .string()
    .max(50, 'Tax number cannot exceed 50 characters')
    .optional(),
  currency: z.string().min(1, 'Currency is required'),
  defaultTaxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
  paymentTerms: z.enum(['7', '14', '30', '60', '90', 'due_on_receipt']),
  invoiceTerms: z
    .string()
    .max(2000, 'Invoice terms cannot exceed 2000 characters'),
});

// Invoice filter validation schema
export const invoiceFilterSchema = z.object({
  status: z.array(z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])).optional(),
  clientId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchTerm: z.string().optional(),
}).refine((data) => {
  // Validate date range
  if (data.dateFrom && data.dateTo) {
    const fromDate = new Date(data.dateFrom);
    const toDate = new Date(data.dateTo);
    return toDate >= fromDate;
  }
  return true;
}, {
  message: 'End date cannot be before start date',
  path: ['dateTo'],
});

// Settings validation schema
export const settingsSchema = z.object({
  defaultTaxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
  defaultPaymentTerms: z.enum(['7', '14', '30', '60', '90', 'due_on_receipt']),
  currency: z.string().min(1, 'Currency is required'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  invoicePrefix: z
    .string()
    .min(1, 'Invoice prefix is required')
    .max(10, 'Invoice prefix cannot exceed 10 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Invoice prefix can only contain uppercase letters, numbers, and hyphens'),
  autoSave: z.boolean(),
  showTaxColumn: z.boolean(),
  compactView: z.boolean(),
});

// Bulk action validation schema
export const bulkActionSchema = z.object({
  action: z.enum(['mark_sent', 'mark_paid', 'mark_cancelled', 'delete']),
  invoiceIds: z
    .array(z.string())
    .min(1, 'Please select at least one invoice'),
  confirmationText: z.string().optional(),
}).refine((data) => {
  // Require confirmation for destructive actions
  if (data.action === 'delete') {
    return data.confirmationText === 'DELETE';
  }
  return true;
}, {
  message: 'Please type "DELETE" to confirm this action',
  path: ['confirmationText'],
});

// Search validation schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query cannot exceed 100 characters'),
  filters: z.object({
    clients: z.boolean().default(true),
    invoices: z.boolean().default(true),
    includeArchived: z.boolean().default(false),
  }),
});

// Export validation schema
export const exportSchema = z.object({
  format: z.enum(['csv', 'json', 'pdf']),
  dateRange: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
  includeClients: z.boolean().default(true),
  includeInvoices: z.boolean().default(true),
  includeBusinessProfile: z.boolean().default(false),
}).refine((data) => {
  // Validate date range
  if (data.dateRange.from && data.dateRange.to) {
    const fromDate = new Date(data.dateRange.from);
    const toDate = new Date(data.dateRange.to);
    return toDate >= fromDate;
  }
  return true;
}, {
  message: 'End date cannot be before start date',
  path: ['dateRange', 'to'],
});

// Password validation schema (for future authentication)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Type exports for form data
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;
export type BusinessProfileData = z.infer<typeof businessProfileSchema>;
export type InvoiceFilterData = z.infer<typeof invoiceFilterSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;
export type BulkActionData = z.infer<typeof bulkActionSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type ExportData = z.infer<typeof exportSchema>;