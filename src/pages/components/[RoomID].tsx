import { useRouter } from 'next/router';
import { Card, Button, Row, Col, Typography, Spin, message } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '@/src/styles/Home.module.css';
import { api, Room } from '@/src/services/api';

const { Title, Paragraph } = Typography;

// Reliable image URLs
const ROOM_IMAGES = {
  'deluxe-king': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&auto=format',
  'luxury-suite': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&auto=format',
  'family-room': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&auto=format',
  'standard-twin': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&auto=format',
  'penthouse': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&auto=format',
  'default': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&auto=format',
};

export default function RoomDetail() {
  const router = useRouter();
  const { RoomID } = router.query;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!RoomID) return;

      try {
        setLoading(true);
        const data = await api.getRoomById(Number(RoomID));
        setRoom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load room details');
        message.error('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [RoomID]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className={styles.errorContainer}>
        <Title level={2}>Error</Title>
        <Paragraph>{error || 'Room not found'}</Paragraph>
        <Button type="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Get appropriate image URL for a room
  const getRoomImage = (room: Room) => {
    if (!room.imageUrl) return ROOM_IMAGES.default;
    
    // If using sample data or API data with known names
    const roomNameLower = room.name.toLowerCase();
    
    if (roomNameLower.includes('deluxe king')) return ROOM_IMAGES['deluxe-king'];
    if (roomNameLower.includes('luxury suite')) return ROOM_IMAGES['luxury-suite'];
    if (roomNameLower.includes('family')) return ROOM_IMAGES['family-room'];
    if (roomNameLower.includes('twin')) return ROOM_IMAGES['standard-twin'];
    if (roomNameLower.includes('penthouse')) return ROOM_IMAGES['penthouse'];
    
    // Default to the provided imageUrl or default
    return room.imageUrl || ROOM_IMAGES.default;
  };

  return (
    <div className={styles.page}>
      <div className={styles.roomDetail}>
        <Button 
          type="link" 
          onClick={() => router.push('/')}
          style={{ marginBottom: '20px' }}
        >
          ← Back to Rooms
        </Button>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <div className={styles.roomImageContainer} style={{ height: '400px' }}>
              <Image
                src={getRoomImage(room)}
                alt={room.name}
                layout="fill"
                objectFit="cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = ROOM_IMAGES.default;
                }}
              />
            </div>
            <Title level={2}>{room.name}</Title>
            <Paragraph>{room.description}</Paragraph>
            
            <Title level={3}>Room Details</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>Location:</strong> {room.location}</p>
                <p><strong>Max Guests:</strong> {room.maxGuests}</p>
              </Col>
              <Col span={12}>
                <p><strong>Price:</strong> {formatPrice(room.price)}/night</p>
              </Col>
            </Row>
          </Col>
          
          <Col xs={24} md={8}>
            <Card>
              <Title level={3}>Amenities</Title>
              <ul>
                {room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <Button 
                type="primary" 
                size="large" 
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => message.success('Booking request sent!')}
              >
                Book Now
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
