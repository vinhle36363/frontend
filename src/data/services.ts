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

// In-memory storage
let services: Service[] = [];

export const getServices = (): Service[] => {
  return services;
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const createService = (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service => {
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  services.push(newService);
  return newService;
};

export const updateService = (id: string, service: Partial<Service>): Service | undefined => {
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return undefined;

  services[index] = {
    ...services[index],
    ...service,
    updatedAt: new Date().toISOString(),
  };
  return services[index];
};

export const deleteService = (id: string): boolean => {
  const initialLength = services.length;
  services = services.filter(service => service.id !== id);
  return services.length < initialLength;
}; 