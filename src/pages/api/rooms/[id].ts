import type { NextApiRequest, NextApiResponse } from 'next';

// This would typically come from a database
const roomDetails = {
  1: {
    id: 1,
    title: "Deluxe Ocean View",
    price: "$299",
    image: "/img/rooms/0dad4e81.webp",
    description: "Spacious room with stunning ocean views",
    fullDescription: "Experience luxury and comfort in our Deluxe Ocean View room. This spacious room features floor-to-ceiling windows offering breathtaking ocean views, a king-size bed, and a private balcony. The room includes modern amenities such as high-speed WiFi, a smart TV, and a mini bar. The en-suite bathroom comes with premium toiletries and a rain shower.",
    amenities: ["Ocean View", "King Size Bed", "Private Balcony", "Free WiFi", "Smart TV", "Mini Bar", "Rain Shower"],
    size: "45 sqm",
    maxGuests: 2
  },
  2: {
    id: 2,
    title: "Premium Suite",
    price: "$499",
    image: "/img/rooms/c0dc64b7.avif",
    description: "Luxury suite with separate living area",
    fullDescription: "Our Premium Suite offers the ultimate luxury experience with a separate living area, perfect for both business and leisure travelers. The suite features a master bedroom with a king-size bed, a spacious living room with a sofa bed, and a dining area. Enjoy premium amenities including a Jacuzzi, a fully equipped kitchen, and a private terrace.",
    amenities: ["Separate Living Area", "King Size Bed", "Jacuzzi", "Kitchen", "Private Terrace", "Dining Area"],
    size: "80 sqm",
    maxGuests: 4
  },
  3: {
    id: 3,
    title: "Family Room",
    price: "$399",
    image: "/img/rooms/02d1cac2.webp",
    description: "Perfect for family stays",
    fullDescription: "Our Family Room is designed to accommodate families with comfort and style. The room features two connecting bedrooms, a spacious living area, and a private balcony. The room includes a king-size bed in the master bedroom and two twin beds in the second bedroom. Additional amenities include a gaming console, a mini kitchen, and a family-friendly bathroom.",
    amenities: ["Two Bedrooms", "Living Area", "Gaming Console", "Mini Kitchen", "Private Balcony", "Family Bathroom"],
    size: "60 sqm",
    maxGuests: 4
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const roomId = Number(id);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const room = roomDetails[roomId as keyof typeof roomDetails];

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  return res.status(200).json(room);
} 