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

// In-memory storage
let customers: Customer[] = [];

export const getCustomers = (): Customer[] => {
  return customers;
};

export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const createCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = (id: string, customer: Partial<Customer>): Customer | undefined => {
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return undefined;

  customers[index] = {
    ...customers[index],
    ...customer,
    updatedAt: new Date().toISOString(),
  };
  return customers[index];
};

export const deleteCustomer = (id: string): boolean => {
  const initialLength = customers.length;
  customers = customers.filter(customer => customer.id !== id);
  return customers.length < initialLength;
}; 