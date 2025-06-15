import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Spin, Typography, List, Badge } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  BellOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/charts";
import AdminLayout from "../../components/admin/AdminLayout";
import WelcomeBanner from "../../components/admin/dashboard/WelcomeBanner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import "../../styles/pages/AdminDashboard.scss";

const { Title, Text } = Typography;

const containerStyle = {
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
};

const cardStyle = {
  minHeight: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: 12,
  boxShadow: "0 2px 8px #f0f1f2",
};

const sectionCardStyle = {
  minHeight: 420,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: 12,
  boxShadow: "0 2px 8px #f0f1f2",
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalManagers: 0,
    totalDoctors: 0,
    totalMembers: 0,
    totalPosts: 0,
    totalRequests: 0,
    totalVisits: 0,
    notifications: [],
  });
  // const cardRef = useRef(null);

  useEffect(() => {
    // Mock data, replace with API call
    setTimeout(() => {
      setDashboardData({
        totalUsers: 2350,
        totalAdmins: 5,
        totalManagers: 12,
        totalDoctors: 30,
        totalMembers: 2303,
        totalPosts: 128,
        totalRequests: 450,
        totalVisits: 12000,
        notifications: [
          {
            type: "success",
            title: "Thêm admin mới",
            message: "Tài khoản admin2 đã được tạo thành công.",
            time: "1 giờ trước",
          },
          {
            type: "info",
            title: "Yêu cầu mới",
            message: "Có 8 yêu cầu mới cần xử lý.",
            time: "2 giờ trước",
          },
          {
            type: "warning",
            title: "Cảnh báo đăng nhập",
            message: "Có đăng nhập bất thường từ IP lạ.",
            time: "4 giờ trước",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Pie chart config for user type
  const userTypePieData = [
    { type: "Admin", value: dashboardData.totalAdmins },
    { type: "Manager", value: dashboardData.totalManagers },
    { type: "Doctor", value: dashboardData.totalDoctors },
    { type: "Member", value: dashboardData.totalMembers },
  ];
  const pieConfig = {
    data: userTypePieData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "spider",
      content: "{name}: {value}",
      style: { fontSize: 14 },
    },
    legend: { position: "bottom" },
    color: ["#ff4d4f", "#faad14", "#1890ff", "#52c41a"],
    height: 260,
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <WelcomeBanner adminName="Quản trị viên" />
      <div style={containerStyle}>
        <AdminPageHeader
          title="Tổng quan hệ thống"
          icon={<PieChartOutlined />}
          subtitle="Xem nhanh các số liệu tổng quan của hệ thống quản trị"
        />
        <div className="admin-dashboard">
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={cardStyle}
                className="statistic-card"
              >
                <Statistic
                  title="Tổng người dùng"
                  value={dashboardData.totalUsers}
                  prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={cardStyle}
                className="statistic-card"
              >
                <Statistic
                  title="Tổng bài viết"
                  value={dashboardData.totalPosts}
                  prefix={<FileTextOutlined style={{ color: "#722ed1" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={cardStyle}
                className="statistic-card"
              >
                <Statistic
                  title="Tổng yêu cầu"
                  value={dashboardData.totalRequests}
                  prefix={<TeamOutlined style={{ color: "#faad14" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={cardStyle}
                className="statistic-card"
              >
                <Statistic
                  title="Lượt truy cập"
                  value={dashboardData.totalVisits}
                  prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card
                bordered={false}
                style={sectionCardStyle}
                className="statistic-card"
                title="Phân loại người dùng"
              >
                <Pie {...pieConfig} />
                <List
                  itemLayout="horizontal"
                  dataSource={userTypePieData}
                  style={{ marginTop: 24 }}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge
                            color={
                              pieConfig.color[
                                userTypePieData.findIndex(
                                  (i) => i.type === item.type
                                )
                              ]
                            }
                            text={item.type}
                          />
                        }
                        title={<Text strong>{item.type}</Text>}
                      />
                      <div
                        style={{
                          fontWeight: 600,
                          color:
                            pieConfig.color[
                              userTypePieData.findIndex(
                                (i) => i.type === item.type
                              )
                            ],
                        }}
                      >
                        {item.value}
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                bordered={false}
                style={sectionCardStyle}
                className="statistic-card"
                title={
                  <span>
                    <BellOutlined /> Thông báo gần đây
                  </span>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={dashboardData.notifications}
                  style={{ minHeight: 260 }}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          item.type === "success" ? (
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          ) : item.type === "warning" ? (
                            <WarningOutlined style={{ color: "#faad14" }} />
                          ) : item.type === "error" ? (
                            <ExclamationCircleOutlined
                              style={{ color: "#ff4d4f" }}
                            />
                          ) : (
                            <InfoCircleOutlined style={{ color: "#1890ff" }} />
                          )
                        }
                        title={<Text strong>{item.title}</Text>}
                        description={<Text>{item.message}</Text>}
                      />
                      <Text type="secondary">{item.time}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
