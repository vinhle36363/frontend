import React, { useEffect, useState } from "react";
import "@/src/styles/admin/style.css";
import Head from "next/head";
import { Col, Row } from "antd";

import SidebarMenu from "@/src/pages/components/sidebarMenu";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import SearchBar from "@/src/pages/components/searchBar";
type WebsiteData = {
  name: string;
  logoname: string;
  phonenumber: string;
  email: string;
  logoLink: string;
};

export default function AdminHome() {
  const [data, setData] = useState<WebsiteData | null>(null);

  useEffect(() => {
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
          <SidebarMenu />
        </div>
        
        <Row className="nav" >
            <Col span={8} >
              <div className="logo">
                <a href={data?.logoLink || "#"}>
                  {data?.logoname || "HotelManagement"}
                </a>
              </div>
            </Col>

            <Col span={8} >
              <div className="search-Bar">
                <SearchBar />
              </div>
            </Col>

            <Col span={8} >
              <div className="top-btn">
                <MessageOutlined style={{ color: "#fff" }} />
              </div>
            </Col>
        </Row>
      </div>
      <div className="main"></div>
    </>
  );
}
