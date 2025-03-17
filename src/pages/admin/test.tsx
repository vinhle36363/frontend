import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme, Col, Row, FloatButton } from "antd";
import "@/src/styles/admin/style.css";
import SearchBar from "@/src/pages/components/searchBar";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import SidebarMenu from "../components/sidebarMenu";
type WebsiteData = {
  name: string;
  logoname: string;
  phonenumber: string;
  email: string;
  logoLink: string;
};
type config = {
  isMenuCollapsed: boolean;
};

const { Header, Sider, Content } = Layout;

export default function AdminHome() {
  const [data, setData] = useState<WebsiteData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  if (collapsed === true) {
  }
  useEffect(() => {
    fetch("/api/websiteConfig")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {!collapsed && (
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
        )}
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row>
            <Col span={12}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col span={12}>
              <SearchBar />
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic
                  title="Tổng doanh thu"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic
                  title="Lượng truy cập theo tuần"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </Content>
        
      <FloatButton.BackTop visibilityHeight={200}/>
      </Layout>
      
    </Layout>
  );
}
