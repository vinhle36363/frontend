import React from "react";
import { Layout, Col, Row, Card, Statistic, Calendar, theme } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Content } = Layout;

const Dashboards: React.FC = () => {
  const { token } = theme.useToken(); 

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Row gutter={16}>
        <Col span={24}><h1><center>Thống kê theo ngày</center></h1>
        </Col>
        <Col span={12}>
          <Card>
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
          <Card>
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
        <Col span={24} style={{ marginTop: 20 }}>
          <Calendar
            style={{
              width: "100%",
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
            fullscreen={false}
          />
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboards;
