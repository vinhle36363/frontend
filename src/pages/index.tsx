import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { DatePicker, Input, Select, Button, Card, Row, Col, message, Spin } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import styles from "@/src/styles/Home.module.css";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { api, Room, SearchParams } from '@/src/services/api';
import moment from 'moment';
import { sampleRooms } from '../data/sample-rooms';

const { RangePicker } = DatePicker;
const { Option } = Select;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ROOM_IMAGES = {
  'deluxe-king': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&auto=format',
  'luxury-suite': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&auto=format',
  'family-room': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&auto=format',
  'standard-twin': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&auto=format',
  'penthouse': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&auto=format',
  'default': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&auto=format',
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState<number | undefined>(undefined);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [location, setLocation] = useState('');

  // Format price with commas
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  useEffect(() => {
    // Get featured rooms on page load
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        const allRooms = await api.searchRooms({});
        // Just take first 3 rooms as featured
        setFeaturedRooms(allRooms.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured rooms:', error);
        message.error('Failed to load featured rooms');
        // Use sample rooms as fallback
        setFeaturedRooms(sampleRooms.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      // Build search params from form inputs
      const searchParams: SearchParams = {};
      if (searchQuery) searchParams.query = searchQuery;
      if (location) searchParams.location = location;
      if (guests) searchParams.guests = guests;
      
      if (dateRange[0] && dateRange[1]) {
        searchParams.checkIn = moment(dateRange[0]).format('YYYY-MM-DD');
        searchParams.checkOut = moment(dateRange[1]).format('YYYY-MM-DD');
      }

      const searchResults = await api.searchRooms(searchParams);
      setRooms(searchResults);
      
      if (searchResults.length === 0) {
        message.info('No rooms found matching your criteria');
      }
    } catch (error) {
      console.error('Error searching rooms:', error);
      message.error('Failed to search rooms');
      // Keep existing results or clear them
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId: number) => {
    router.push(`/rooms/${roomId}`);
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
    <>
      <Head>
        <title>Luxury Hotel Booking</title>
        <meta name="description" content="Book your perfect hotel stay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to Luxury Hotel</h1>
            <p>Experience the perfect stay with us</p>
          </div>
          
          {/* Search Box */}
          <Card className={styles.searchBox}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8}>
                <Input
                  size="large"
                  placeholder="Where do you want to stay?"
                  prefix={<SearchOutlined />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['Check-in', 'Check-out']}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange([dates[0]?.toDate() || null, dates[1]?.toDate() || null]);
                    }
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={4}>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Guests"
                  prefix={<UserOutlined />}
                  value={guests}
                  onChange={setGuests}
                >
                  <Option value={1}>1 Guest</Option>
                  <Option value={2}>2 Guests</Option>
                  <Option value={3}>3 Guests</Option>
                  <Option value={4}>4+ Guests</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={4}>
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ width: '100%' }}
                  onClick={handleSearch}
                  loading={loading}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Featured Rooms */}
        <section className={styles.featuredRooms}>
          <h2>{rooms.length > 0 ? 'Search Results' : 'Featured Rooms'}</h2>
          <Row gutter={[24, 24]}>
            {(rooms.length > 0 ? rooms : featuredRooms).map(room => (
              <Col key={room.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => handleRoomClick(room.id)}
                  cover={
                    <div className={styles.roomImageContainer}>
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
                  }
                >
                  <Card.Meta
                    title={<div className={styles.roomTitle}>
                      <span>{room.name}</span>
                      <span className={styles.roomPrice}>{formatPrice(room.price)}</span>
                    </div>}
                    description={room.description}
                  />
                  <Button 
                    type="primary" 
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room.id);
                    }}
                  >
                    Book Now
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Admin Links */}
        <div className={styles.adminLinks}>
          <Button type="link" href="/admin">
            Admin Portal
          </Button>
          <Button type="link" href="/admin/test">
            Test Admin Menu
          </Button>
        </div>

        <footer className={styles.footer}>
          <p>© 2024 Luxury Hotel. Created by: Vinh, Phúc, Nguyên</p>
        </footer>
      </div>
    </>
  );
}
