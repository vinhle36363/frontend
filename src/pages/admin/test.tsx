import React, { useState } from "react";
import { Layout } from "antd";
import SidebarMenu from "../components/sidebarMenu";

const { Content } = Layout;

const AdminTest: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarMenu setActiveComponent={setActiveComponent} />
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {activeComponent || 'Content will be displayed here'}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminTest;
