import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { DatePicker, Input, Select, Button, Card, Row, Col } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import styles from "@/src/styles/Home.module.css";

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

const featuredRooms = [
  {
    id: 1,
    title: "Deluxe Ocean View",
    price: "$299",
    image: "/rooms/deluxe-ocean.jpg",
    description: "Spacious room with stunning ocean views"
  },
  {
    id: 2,
    title: "Premium Suite",
    price: "$499",
    image: "/rooms/premium-suite.jpg",
    description: "Luxury suite with separate living area"
  },
  {
    id: 3,
    title: "Family Room",
    price: "$399",
    image: "/rooms/family-room.jpg",
    description: "Perfect for family stays"
  }
];

export default function Home() {
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
                />
              </Col>
              <Col xs={24} sm={24} md={8}>
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
                <Button type="primary" size="large" style={{ width: '100%' }}>
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Featured Rooms */}
        <section className={styles.featuredRooms}>
          <h2>Featured Rooms</h2>
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
                    </div>
                  }
                >
                  <Card.Meta
                    title={<div className={styles.roomTitle}>
                      <span>{room.title}</span>
                      <span className={styles.roomPrice}>{room.price}</span>
                    </div>}
                    description={room.description}
                  />
                  <Button type="primary" style={{ marginTop: '1rem', width: '100%' }}>
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
