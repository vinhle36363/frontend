import React, { useEffect, useState } from "react";
import "@/src/styles/admin/style.css";
import Head from "next/head";
import SidebarMenu from "@/src/pages/components/sidebarMenu";
import { MessageOutlined } from "@ant-design/icons";

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
        <div className="h-left">
          <SidebarMenu />
        </div>
        <div className="nav">
          <div className="logo">
            <a href={data?.logoLink || "#"}>{data?.logoname || "HotelManagement"}</a>
          </div>
          <div className="top-btn">
          <MessageOutlined 
          style={{color: "#fff"}}/>
          </div>
        </div>
      </div>
    </>
  );
}
