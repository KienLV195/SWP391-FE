import React from "react";
import { Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const AdminPageHeader = ({ title, icon, subtitle }) => (
  <div
    style={{
      background: "#fff",
      marginBottom: 24,
      boxShadow: "0 2px 8px #f0f1f2",
      borderRadius: 8,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxWidth: 1200,
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
    }}
  >
    <Row align="middle" gutter={16}>
      <Col>{icon && <span style={{ fontSize: 32 }}>{icon}</span>}</Col>
      <Col flex="auto">
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          {title}
        </Title>
        {subtitle && (
          <Text style={{ fontSize: 16, color: "#888" }}>{subtitle}</Text>
        )}
      </Col>
    </Row>
  </div>
);

export default AdminPageHeader;
