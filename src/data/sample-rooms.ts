import { Room } from '../services/api';

export const sampleRooms: Room[] = [
  {
    id: 1,
    name: 'Deluxe King Room',
    price: 250,
    description: 'Spacious room with king-size bed and city view',
    imageUrl: '/img/rooms/deluxe-king.jpg',
    location: 'Main Building',
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'Minibar', 'TV', 'Air Conditioning', 'Room Service']
  },
  {
    id: 2,
    name: 'Luxury Suite',
    price: 450,
    description: 'Large suite with separate living area and ocean view',
    imageUrl: '/img/rooms/luxury-suite.jpg',
    location: 'Executive Wing',
    maxGuests: 3,
    amenities: ['Free Wi-Fi', 'Minibar', 'TV', 'Air Conditioning', 'Room Service', 'Jacuzzi']
  },
  {
    id: 3,
    name: 'Family Room',
    price: 350,
    description: 'Perfect for families with children, includes two queen beds',
    imageUrl: '/img/rooms/family-room.jpg',
    location: 'West Wing',
    maxGuests: 4,
    amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning', 'Connecting Rooms']
  },
  {
    id: 4, 
    name: 'Standard Twin',
    price: 180,
    description: 'Comfortable room with two twin beds',
    imageUrl: '/img/rooms/standard-twin.jpg',
    location: 'North Wing',
    maxGuests: 2,
    amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning']
  },
  {
    id: 5,
    name: 'Penthouse Suite',
    price: 800,
    description: 'Luxurious top-floor suite with panoramic views',
    imageUrl: '/img/rooms/penthouse.jpg',
    location: 'Penthouse Floor',
    maxGuests: 4,
    amenities: ['Free Wi-Fi', 'Minibar', 'TV', 'Air Conditioning', 'Room Service', 'Jacuzzi', 'Private Terrace']
  }
]; 