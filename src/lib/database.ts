// Define types for all entities
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'available' | 'unavailable';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

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

// Database class to manage all data
class Database {
  private static instance: Database;
  private users: User[] = [];
  private customers: Customer[] = [];
  private services: Service[] = [];
  private invoices: Invoice[] = [];

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // User methods
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(id: string, user: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      ...user,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  public deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }

  // Customer methods
  public getCustomers(): Customer[] {
    return this.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  public createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  public updateCustomer(id: string, customer: Partial<Customer>): Customer | undefined {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    this.customers[index] = {
      ...this.customers[index],
      ...customer,
      updatedAt: new Date().toISOString(),
    };
    return this.customers[index];
  }

  public deleteCustomer(id: string): boolean {
    const initialLength = this.customers.length;
    this.customers = this.customers.filter(customer => customer.id !== id);
    return this.customers.length < initialLength;
  }

  // Service methods
  public getServices(): Service[] {
    return this.services;
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.find(service => service.id === id);
  }

  public createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.services.push(newService);
    return newService;
  }

  public updateService(id: string, service: Partial<Service>): Service | undefined {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    this.services[index] = {
      ...this.services[index],
      ...service,
      updatedAt: new Date().toISOString(),
    };
    return this.services[index];
  }

  public deleteService(id: string): boolean {
    const initialLength = this.services.length;
    this.services = this.services.filter(service => service.id !== id);
    return this.services.length < initialLength;
  }

  // Invoice methods
  public getInvoices(): Invoice[] {
    return this.invoices;
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.find(invoice => invoice.id === id);
  }

  public createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.push(newInvoice);
    return newInvoice;
  }

  public updateInvoice(id: string, invoice: Partial<Invoice>): Invoice | undefined {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index === -1) return undefined;

    this.invoices[index] = {
      ...this.invoices[index],
      ...invoice,
      updatedAt: new Date().toISOString(),
    };
    return this.invoices[index];
  }

  public deleteInvoice(id: string): boolean {
    const initialLength = this.invoices.length;
    this.invoices = this.invoices.filter(invoice => invoice.id !== id);
    return this.invoices.length < initialLength;
  }

  // Helper methods for invoice calculations
  public calculateInvoiceTotals(items: InvoiceItem[], tax: number = 0): { subtotal: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + tax;
    return { subtotal, total };
  }
}

export const db = Database.getInstance(); 