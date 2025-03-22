import React, { useState, useEffect } from "react"; 
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Button, Layout, Col, Row, FloatButton, theme } from "antd";
import "@/src/styles/admin/style.css";
import SearchBar from "@/src/pages/components/searchBar";
import SidebarMenu from "../components/sidebarMenu";
import Dashboards from "./dashboards";
type WebsiteData = {
  name: string;
  logoname: string;
  phonenumber: string;
  email: string;
  logoLink: string;
};

const { Header, Sider, Content } = Layout;

export default function AdminHome() {
  const { token } = theme.useToken();
  const [data, setData] = useState<WebsiteData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);

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
            <div className="sidebar-name" style={{ fontSize: "20px", fontWeight: "bold" }}>
              {data?.name}
            </div>
            <div className="sidebar-title">{data?.logoname}</div>
          </div>
        )}
        <SidebarMenu setActiveComponent={setActiveComponent} />
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: token.colorBgContainer }}>
          <Row>
            <Col span={12}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 64, height: 64 }}
              />
            </Col>
            <Col span={12}>
              <SearchBar />
            </Col>
          </Row>
        </Header>

        {activeComponent ? (
          <Content style={{ margin: "24px 8px", padding: 24, minHeight: 280 }}>
            {activeComponent}
          </Content>
        ) : (
        <Dashboards/>
        )}

        <FloatButton.BackTop visibilityHeight={200} />
      </Layout>
    </Layout>
  );
}
