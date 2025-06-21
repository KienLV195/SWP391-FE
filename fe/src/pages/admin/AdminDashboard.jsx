import React from "react";
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
import { getUserName } from "../../utils/userUtils";
import useRequest from "../../hooks/useFetchData";
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

const fetchDashboardData = async () => {
  // Simulate loading dashboard data
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    totalUsers: 1250,
    totalPosts: 45,
    totalRequests: 89,
    totalVisits: 5670,
    totalAdmins: 3,
    totalManagers: 5,
    totalDoctors: 12,
    totalMembers: 1230,
    notifications: [
      {
        id: 1,
        type: "success",
        title: "Hệ thống hoạt động bình thường",
        message: "Tất cả dịch vụ đang hoạt động ổn định.",
        time: "2 phút trước",
      },
      {
        id: 2,
        type: "warning",
        title: "Cần bổ sung máu nhóm O-",
        message: "Kho máu nhóm O- đang ở mức thấp.",
        time: "15 phút trước",
      },
      {
        id: 3,
        type: "info",
        title: "Cập nhật hệ thống",
        message: "Hệ thống đã được cập nhật phiên bản mới.",
        time: "1 giờ trước",
      },
      {
        id: 4,
        type: "error",
        title: "Đăng nhập bất thường",
        message: "Có đăng nhập bất thường từ IP lạ.",
        time: "4 giờ trước",
      },
    ],
  };
};

const AdminDashboard = () => {
  const { data: dashboardData = {}, loading } = useRequest(
    fetchDashboardData,
    []
  );

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

  const adminName = getUserName();

  return (
    <AdminLayout>
      <WelcomeBanner adminName={adminName} />
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

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={sectionCardStyle}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  Phân loại người dùng
                </Title>
                <Pie {...pieConfig} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} style={sectionCardStyle}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  Thông báo hệ thống
                </Title>
                <List
                  itemLayout="horizontal"
                  dataSource={dashboardData.notifications}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge
                            status={
                              item.type === "success"
                                ? "success"
                                : item.type === "warning"
                                ? "warning"
                                : item.type === "error"
                                ? "error"
                                : "processing"
                            }
                          />
                        }
                        title={item.title}
                        description={item.message}
                      />
                      <div style={{ color: "#888" }}>{item.time}</div>
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
