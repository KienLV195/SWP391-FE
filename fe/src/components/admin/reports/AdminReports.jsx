import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const AdminReports = () => {
  const stats = [
    {
      title: "Tổng người dùng",
      value: 100,
      icon: <UserOutlined />,
    },
    {
      title: "Tổng bài viết",
      value: 20,
      icon: <FileTextOutlined />,
    },
    {
      title: "Yêu cầu máu",
      value: 15,
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Báo cáo tổng quan (Test)</h2>
      <Row gutter={[16, 16]}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 32, color: "#888" }}>
        <i>
          Dữ liệu chỉ là ví dụ test, hãy kết nối API để lấy dữ liệu thực tế.
        </i>
      </div>
    </div>
  );
};

export default AdminReports;
