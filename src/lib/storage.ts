import { Invoice, Client, BusinessProfile, DashboardStats } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  INVOICES: 'invoice-app-invoices',
  CLIENTS: 'invoice-app-clients',
  BUSINESS_PROFILE: 'invoice-app-business-profile',
  SETTINGS: 'invoice-app-settings',
} as const;

// Generic storage utilities
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage with key ${key}:`, error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key ${key}:`, error);
  }
};

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Invoice storage utilities
export const saveInvoices = (invoices: Invoice[]): void => {
  saveToStorage(STORAGE_KEYS.INVOICES, invoices);
};

export const loadInvoices = (): Invoice[] => {
  const invoices = loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, []);
  // Convert string dates back to Date objects
  return invoices.map(invoice => ({
    ...invoice,
    issueDate: new Date(invoice.issueDate),
    dueDate: new Date(invoice.dueDate),
    createdAt: new Date(invoice.createdAt),
    updatedAt: new Date(invoice.updatedAt),
    paidAt: invoice.paidAt ? new Date(invoice.paidAt) : undefined,
  }));
};

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = loadInvoices();
  const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
  
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  saveInvoices(invoices);
};

export const deleteInvoice = (invoiceId: string): void => {
  const invoices = loadInvoices();
  const filteredInvoices = invoices.filter(inv => inv.id !== invoiceId);
  saveInvoices(filteredInvoices);
};

export const getInvoiceById = (invoiceId: string): Invoice | null => {
  const invoices = loadInvoices();
  return invoices.find(inv => inv.id === invoiceId) || null;
};

export const getInvoiceByNumber = (invoiceNumber: string): Invoice | null => {
  const invoices = loadInvoices();
  return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null;
};

// Client storage utilities
export const saveClients = (clients: Client[]): void => {
  saveToStorage(STORAGE_KEYS.CLIENTS, clients);
};

export const loadClients = (): Client[] => {
  const clients = loadFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, []);
  // Convert string dates back to Date objects
  return clients.map(client => ({
    ...client,
    createdAt: new Date(client.createdAt),
    updatedAt: new Date(client.updatedAt),
  }));
};

export const saveClient = (client: Client): void => {
  const clients = loadClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }
  
  saveClients(clients);
};

export const deleteClient = (clientId: string): void => {
  const clients = loadClients();
  const filteredClients = clients.filter(c => c.id !== clientId);
  saveClients(filteredClients);
};

export const getClientById = (clientId: string): Client | null => {
  const clients = loadClients();
  return clients.find(c => c.id === clientId) || null;
};

export const searchClients = (searchTerm: string): Client[] => {
  const clients = loadClients();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(lowerSearchTerm) ||
    client.company.toLowerCase().includes(lowerSearchTerm) ||
    client.email.toLowerCase().includes(lowerSearchTerm)
  );
};

// Business Profile storage utilities
export const saveBusinessProfile = (profile: BusinessProfile): void => {
  saveToStorage(STORAGE_KEYS.BUSINESS_PROFILE, profile);
};

export const loadBusinessProfile = (): BusinessProfile | null => {
  const profile = loadFromStorage<BusinessProfile | null>(STORAGE_KEYS.BUSINESS_PROFILE, null);
  if (!profile) return null;
  
  // Convert string dates back to Date objects
  return {
    ...profile,
    createdAt: new Date(profile.createdAt),
    updatedAt: new Date(profile.updatedAt),
  };
};

export const getDefaultBusinessProfile = (): BusinessProfile => {
  const now = new Date();
  return {
    id: 'default-business-profile',
    companyName: 'Your Company Name',
    ownerName: 'Your Name',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    website: 'https://yourcompany.com',
    logo: '',
    address: {
      street: '123 Business Street',
      city: 'Business City',
      state: 'BC',
      zipCode: '12345',
      country: 'United States',
    },
    taxNumber: '',
    currency: 'USD',
    currencySymbol: '$',
    defaultTaxRate: 8.25,
    paymentTerms: '30',
    invoiceTerms: 'Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge.',
    createdAt: now,
    updatedAt: now,
  };
};

// Dashboard statistics calculation
export const calculateDashboardStats = (invoices: Invoice[]): DashboardStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Filter invoices for current month
  const monthlyInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.issueDate);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
  });
  
  // Calculate basic stats
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const monthlyRevenue = monthlyInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => 
    inv.status === 'sent' || inv.status === 'draft'
  ).length;
  
  // Calculate overdue invoices and amounts
  const overdueInvoices = invoices.filter(inv => {
    if (inv.status === 'paid' || inv.status === 'cancelled') return false;
    return new Date() > new Date(inv.dueDate);
  });
  
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
  
  const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / paidInvoices : 0;
  
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    overdueInvoices: overdueInvoices.length,
    overdueAmount: Math.round(overdueAmount * 100) / 100,
    averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
  };
};

// Data export utilities
export const exportData = () => {
  const invoices = loadInvoices();
  const clients = loadClients();
  const businessProfile = loadBusinessProfile();
  
  return {
    invoices,
    clients,
    businessProfile,
    exportedAt: new Date(),
    version: '1.0',
  };
};

export const importData = (data: any): boolean => {
  try {
    if (data.invoices) {
      saveInvoices(data.invoices);
    }
    if (data.clients) {
      saveClients(data.clients);
    }
    if (data.businessProfile) {
      saveBusinessProfile(data.businessProfile);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Initialize sample data
export const initializeSampleData = (): void => {
  const existingInvoices = loadInvoices();
  const existingClients = loadClients();
  
  if (existingInvoices.length === 0 && existingClients.length === 0) {
    // Create sample clients
    const sampleClients: Client[] = [
      {
        id: 'client-1',
        name: 'John Smith',
        company: 'Acme Corporation',
        email: 'john.smith@acme.com',
        phone: '+1 (555) 234-5678',
        address: {
          street: '456 Corporate Blvd',
          city: 'Business City',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'client-2',
        name: 'Sarah Johnson',
        company: 'Tech Innovations LLC',
        email: 'sarah@techinnovations.com',
        phone: '+1 (555) 345-6789',
        address: {
          street: '789 Innovation Drive',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94025',
          country: 'United States',
        },
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
      },
    ];
    
    saveClients(sampleClients);
    
    // Create sample invoices
    const sampleInvoices: Invoice[] = [
      {
        id: 'invoice-1',
        invoiceNumber: 'INV-2024-0001',
        clientId: 'client-1',
        issueDate: new Date('2024-12-01'),
        dueDate: new Date('2024-12-31'),
        status: 'sent',
        items: [
          {
            id: 'item-1',
            description: 'Web Development Services',
            quantity: 40,
            rate: 125.00,
            taxRate: 8.25,
            amount: 5000.00,
          },
          {
            id: 'item-2',
            description: 'Project Management',
            quantity: 10,
            rate: 150.00,
            taxRate: 8.25,
            amount: 1500.00,
          },
        ],
        subtotal: 6500.00,
        taxAmount: 536.25,
        discountAmount: 0,
        discountType: 'fixed',
        discountValue: 0,
        total: 7036.25,
        paymentTerms: '30',
        notes: 'Thank you for your business!',
        terms: 'Payment is due within 30 days of invoice date.',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: 'invoice-2',
        invoiceNumber: 'INV-2024-0002',
        clientId: 'client-2',
        issueDate: new Date('2024-12-10'),
        dueDate: new Date('2024-12-17'),
        status: 'paid',
        items: [
          {
            id: 'item-3',
            description: 'UI/UX Design Consultation',
            quantity: 20,
            rate: 100.00,
            taxRate: 8.25,
            amount: 2000.00,
          },
        ],
        subtotal: 2000.00,
        taxAmount: 165.00,
        discountAmount: 100.00,
        discountType: 'fixed',
        discountValue: 100.00,
        total: 2065.00,
        paymentTerms: '7',
        notes: 'Early payment discount applied.',
        terms: 'Payment is due within 7 days of invoice date.',
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-15'),
        paidAt: new Date('2024-12-15'),
      },
    ];
    
    saveInvoices(sampleInvoices);
  }
};