import React, { useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { DatePicker, Input, Select, Button, Card, Row, Col, Typography } from 'antd';
import { SearchOutlined, UserOutlined, HeartOutlined, StarOutlined, MenuOutlined } from '@ant-design/icons';
import styles from "@/src/styles/Home.module.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Paragraph } = Typography;

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Room type interface
interface Room {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  rating: number;
}

// Featured rooms data
const featuredRooms: Room[] = [
  {
    id: 1,
    title: "Deluxe Ocean View",
    price: 299,
    image: "/rooms/deluxe-ocean.jpg",
    description: "Spacious room with stunning ocean views",
    rating: 4.8
  },
  {
    id: 2,
    title: "Premium Suite",
    price: 499,
    image: "/rooms/premium-suite.jpg",
    description: "Luxury suite with separate living area",
    rating: 4.9
  },
  {
    id: 3,
    title: "Family Room",
    price: 399,
    image: "/rooms/family-room.jpg",
    description: "Perfect for family stays",
    rating: 4.7
  }
];

const HomePage: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  return (
    <>
      <Head>
        <title>Luxury Hotel Booking</title>
        <meta name="description" content="Book your perfect hotel stay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        {/* Navigation */}
        <nav className={styles.navigation}>
          <div className={styles.navContainer}>
            <div className={styles.logo}>Luxury Hotel</div>
            <Button 
              type="text" 
              className={styles.mobileMenuButton}
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
            <div className={`${styles.navLinks} ${mobileMenuVisible ? styles.showMobile : ''}`}>
              <a href="/">Home</a>
              <a href="/rooms">Rooms</a>
              <a href="/dining">Dining</a>
              <a href="/amenities">Amenities</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <Title level={1}>Discover Your Perfect Stay</Title>
            <Paragraph>Experience luxury, comfort, and unforgettable moments</Paragraph>
          </div>
          
          {/* Search Box */}
          <Card className={styles.searchBox} bordered={false}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} md={6}>
                <Input
                  size="large"
                  placeholder="Destination"
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={24} md={6}>
                <RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['Check-in', 'Check-out']}
                />
              </Col>
              <Col xs={24} sm={24} md={4}>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Guests"
                  prefix={<UserOutlined />}
                >
                  <Option value="1">1 Guest</Option>
                  <Option value="2">2 Guests</Option>
                  <Option value="3">3 Guests</Option>
                  <Option value="4">4+ Guests</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={4}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<SearchOutlined />}
                  style={{ width: '100%' }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Featured Rooms Section */}
        <section className={styles.featuredRooms}>
          <Title level={2} className={styles.sectionTitle}>Featured Rooms</Title>
          <Row gutter={[24, 24]}>
            {featuredRooms.map(room => (
              <Col key={room.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  cover={
                    <div className={styles.roomImageContainer}>
                      <Image
                        src={room.image}
                        alt={room.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <Button 
                        type="text" 
                        icon={<HeartOutlined />} 
                        className={styles.favoriteButton}
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <div className={styles.roomTitleContainer}>
                        <span>{room.title}</span>
                        <div className={styles.roomRating}>
                          <StarOutlined /> {room.rating}
                        </div>
                      </div>
                    }
                    description={
                      <div className={styles.roomDescription}>
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {room.description}
                        </Paragraph>
                        <div className={styles.roomPrice}>
                          ${room.price}/night
                        </div>
                      </div>
                    }
                  />
                  <Button 
                    type="primary" 
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    Book Now
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <Paragraph>© 2024 Luxury Hotel. All Rights Reserved.</Paragraph>
          <Row gutter={[16, 16]} justify="center">
            <Col><a href="/privacy">Privacy Policy</a></Col>
            <Col><a href="/terms">Terms of Service</a></Col>
            <Col><a href="/contact">Contact Us</a></Col>
          </Row>
        </footer>
      </div>
    </>
  );
};

export default HomePage;