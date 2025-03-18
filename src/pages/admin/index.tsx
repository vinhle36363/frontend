import React, { useEffect, useState } from "react";
import "@/src/styles/admin/style.css";
import Head from "next/head";
import { redirect } from 'next/navigation'
import {Router, useRouter} from 'next/router'
import { Col, Row, FloatButton, Badge } from "antd";
import SidebarMenu from "@/src/pages/components/sidebarMenu";
import {
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SearchBar from "@/src/pages/components/searchBar";
type WebsiteData = {
  name: string;
  logoname: string;
  phonenumber: string;
  email: string;
  logoLink: string;
};

export default function AdminHome() {
  
  const router = useRouter();
  
  const [data, setData] = useState<WebsiteData | null>(null);

  const [hasMessage] = useState(2);
  const [hasNotification] = useState(3);
  useEffect(() => {
    router.push("/admin/test");
    fetch("/api/websiteConfig")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Admin page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="header">
        <div className="sidebar">
          <div className="top-sidebar">
            <div className="sidebar-avt">
              <UserOutlined style={{ fontSize: "50px", float: "left" }} />
            </div>
            <div
              className="sidebar-name"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              {data?.name}
            </div>
            <div className="sidebar-title">{data?.logoname}</div>
          </div>
          <div className="sidebarMenu">
          <SidebarMenu />
          </div>
        </div>

        <Row className="nav">
          <Col span={8}>
            <div className="logo">
              <a href={data?.logoLink || "#"}>
                {data?.logoname || "HotelManagement"}
              </a>
            </div>
          </Col>

          <Col span={8}>
            <div className="search-Bar">
              <SearchBar />
            </div>
          </Col>

          <Col span={8}>
            <div className="top-btn">
              <button
                style={{
                  border: "none",
                  background: "none",
                  position: "relative",
                }}
              >
                <Badge count={hasMessage} overflowCount={9}>
                  <MessageOutlined
                    style={{ color: "#fff", fontSize: "25px" }}
                  />
                </Badge>
              </button>

              {/* Icon Thông báo */}
              <button
                style={{
                  border: "none",
                  background: "none",
                  paddingLeft: "20px",
                  position: "relative",
                }}
              >
                <Badge count={hasNotification} overflowCount={9}>
                  <BellOutlined style={{ color: "#fff", fontSize: "25px" }} />
                </Badge>
              </button>
              <button
                style={{
                  border: "none",
                  background: "none",
                  paddingLeft: "20px",
                }}
              >
                <SettingOutlined style={{ color: "#fff", fontSize: "25px" }} />
              </button>

              <button
                style={{
                  border: "none",
                  background: "none",
                  paddingLeft: "20px",
                }}
              >
                <UserOutlined style={{ color: "#fff", fontSize: "25px" }} />
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div className="main">
        <h1>Test</h1>
      </div>
      <FloatButton.BackTop />
    </>
  );
}
