// Using relative URL since we're using Next.js proxy
import { sampleRooms } from '../data/sample-rooms';

// API endpoints to try - will try each one in order until one works
const API_ENDPOINTS = [
  '/api/rooms',       // lowercase (Next.js proxy)
  '/api/Rooms',       // uppercase (Next.js proxy)
];

export interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  location: string;
  maxGuests: number;
  amenities: string[];
}

export interface SearchParams {
  query?: string;
  location?: string;
  priceRange?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
    });
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Try each API endpoint in order
  let lastError = null;
  
  for (const apiBase of API_ENDPOINTS) {
    const url = `${apiBase}${endpoint}`;
    console.log('Trying API Request:', {
      url,
      method: options.method || 'GET',
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      return await handleResponse<T>(response);
    } catch (error) {
      console.warn(`Request to ${url} failed:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }

  // If we get here, all attempts failed
  throw lastError || new Error('All API requests failed');
}

export const api = {
  async searchRooms(params: SearchParams): Promise<Room[]> {
    try {
      // Get all rooms first
      const rooms = await fetchApi<Room[]>('');
      console.log('Fetched rooms:', rooms);

      // Filter based on search parameters
      return rooms.filter(room => {
        if (params.query) {
          const query = params.query.toLowerCase();
          const matchesQuery = 
            room.name.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query) ||
            room.location.toLowerCase().includes(query);
          if (!matchesQuery) return false;
        }

        if (params.guests && room.maxGuests < params.guests) {
          return false;
        }

        if (params.location) {
          const location = params.location.toLowerCase();
          if (!room.location.toLowerCase().includes(location)) {
            return false;
          }
        }

        if (params.priceRange) {
          const [min, max] = params.priceRange.split('-').map(Number);
          if (room.price < min || room.price > max) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Search rooms error:', error);
      console.log('Using sample rooms data instead');
      
      // Use sample data as fallback
      let rooms = [...sampleRooms];
      
      // Apply the same filtering logic to the sample data
      return rooms.filter(room => {
        if (params.query) {
          const query = params.query.toLowerCase();
          const matchesQuery = 
            room.name.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query) ||
            room.location.toLowerCase().includes(query);
          if (!matchesQuery) return false;
        }

        if (params.guests && room.maxGuests < params.guests) {
          return false;
        }

        if (params.location) {
          const location = params.location.toLowerCase();
          if (!room.location.toLowerCase().includes(location)) {
            return false;
          }
        }

        if (params.priceRange) {
          const [min, max] = params.priceRange.split('-').map(Number);
          if (room.price < min || room.price > max) {
            return false;
          }
        }

        return true;
      });
    }
  },

  async getRoomById(id: number): Promise<Room> {
    try {
      return await fetchApi<Room>(`/${id}`);
    } catch (error) {
      console.error('Get room by id error:', error);
      console.log('Using sample room data instead');
      
      // Find the room in the sample data
      const room = sampleRooms.find(r => r.id === id);
      if (room) {
        return room;
      }
      
      throw new Error(`Room with ID ${id} not found`);
    }
  }
};
