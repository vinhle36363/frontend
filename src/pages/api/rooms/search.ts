import type { NextApiRequest, NextApiResponse } from 'next';

// This would typically come from a database
const rooms = [
  {
    id: 1,
    title: "Deluxe Ocean View",
    price: "$299",
    image: "/img/rooms/0dad4e81.webp",
    description: "Spacious room with stunning ocean views",
    location: "Beachfront",
    amenities: ["Ocean View", "King Size Bed", "Private Balcony", "Free WiFi", "Smart TV", "Mini Bar", "Rain Shower"]
  },
  {
    id: 2,
    title: "Premium Suite",
    price: "$499",
    image: "/img/rooms/c0dc64b7.avif",
    description: "Luxury suite with separate living area",
    location: "City Center",
    amenities: ["Separate Living Area", "King Size Bed", "Jacuzzi", "Kitchen", "Private Terrace", "Dining Area"]
  },
  {
    id: 3,
    title: "Family Room",
    price: "$399",
    image: "/img/rooms/02d1cac2.webp",
    description: "Perfect for family stays",
    location: "Resort Area",
    amenities: ["Two Bedrooms", "Living Area", "Gaming Console", "Mini Kitchen", "Private Balcony", "Family Bathroom"]
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query, location, priceRange, guests } = req.query;

  let filteredRooms = [...rooms];

  // Filter by search query
  if (query && typeof query === 'string') {
    const searchQuery = query.toLowerCase();
    filteredRooms = filteredRooms.filter(room => 
      room.title.toLowerCase().includes(searchQuery) ||
      room.description.toLowerCase().includes(searchQuery) ||
      room.location.toLowerCase().includes(searchQuery)
    );
  }

  // Filter by location
  if (location && typeof location === 'string') {
    filteredRooms = filteredRooms.filter(room => 
      room.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Filter by price range
  if (priceRange && typeof priceRange === 'string') {
    const [min, max] = priceRange.split('-').map(Number);
    filteredRooms = filteredRooms.filter(room => {
      const price = Number(room.price.replace('$', ''));
      return price >= min && price <= max;
    });
  }

  // Filter by number of guests
  if (guests && typeof guests === 'string') {
    const guestCount = Number(guests);
    filteredRooms = filteredRooms.filter(room => {
      // This is a simplified logic - in a real app, you'd have maxGuests in the room data
      return guestCount <= 4; // Assuming all rooms can accommodate up to 4 guests
    });
  }

  return res.status(200).json(filteredRooms);
} 