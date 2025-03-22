export interface InvoiceItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let invoices: Invoice[] = [];

export const getInvoices = (): Invoice[] => {
  return invoices;
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  return invoices.find(invoice => invoice.id === id);
};

export const createInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  return newInvoice;
};

export const updateInvoice = (id: string, invoice: Partial<Invoice>): Invoice | undefined => {
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return undefined;

  invoices[index] = {
    ...invoices[index],
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
  return invoices[index];
};

export const deleteInvoice = (id: string): boolean => {
  const initialLength = invoices.length;
  invoices = invoices.filter(invoice => invoice.id !== id);
  return invoices.length < initialLength;
};

export const calculateInvoiceTotals = (items: InvoiceItem[], tax: number = 0): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + tax;
  return { subtotal, total };
}; 