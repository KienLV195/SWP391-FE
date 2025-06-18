import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Typography, Divider } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  EditOutlined,
  BarChartOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import authService from "../../services/authService";
import { getUserName } from "../../utils/userUtils";
import "../../styles/base/manager-design-system.scss";

const { Sider } = Layout;
const { Text } = Typography;

const ManagerSidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      key: "/manager",
      label: "Dashboard",
      icon: <HomeOutlined />,
      path: "/manager",
      exact: true,
    },
    {
      key: "/manager/donation-schedule",
      label: "Lịch & Quy trình hiến máu",
      icon: <CalendarOutlined />,
      path: "/manager/donation-schedule",
    },
    {
      key: "/manager/eligible-donors",
      label: "Người hiến đủ điều kiện",
      icon: <UserOutlined />,
      path: "/manager/eligible-donors",
    },
    {
      key: "/manager/blood-requests",
      label: "Quản lý yêu cầu máu",
      icon: <FileTextOutlined />,
      path: "/manager/blood-requests",
    },
    {
      key: "/manager/blood-inventory",
      label: "Quản lý kho máu",
      icon: <DatabaseOutlined />,
      path: "/manager/blood-inventory",
    },
    {
      key: "/manager/reports",
      label: "Báo cáo & Thống kê",
      icon: <BarChartOutlined />,
      path: "/manager/reports",
    },
    {
      key: "/manager/notifications",
      label: "Thông báo",
      icon: <BellOutlined />,
      path: "/manager/notifications",
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const exactMatch = navItems.find(
      (item) => item.exact && item.path === currentPath
    );
    if (exactMatch) return [exactMatch.key];

    const pathMatch = navItems.find(
      (item) => !item.exact && currentPath.startsWith(item.path)
    );
    return pathMatch ? [pathMatch.key] : [];
  };

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link to={item.path} style={{ color: "inherit", textDecoration: "none" }}>
        {item.label}
      </Link>
    ),
  }));

  const managerName = getUserName();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={280}
      collapsedWidth={80}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: "#20374E",
      }}
      className="manager-sidebar"
    >
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          style={{
            padding: collapsed ? "16px 8px" : "24px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: collapsed ? "center" : "left",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{
              fontSize: "16px",
              width: collapsed ? 40 : 64,
              height: 40,
              color: "white",
              marginBottom: collapsed ? 0 : 16,
            }}
          />

          {!collapsed && (
            <>
              <div
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: "4px",
                }}
              >
                Quản lý Máu
              </div>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Hệ thống quản lý
              </Text>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            items={menuItems}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
            }}
            theme="dark"
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: collapsed ? "16px 8px" : "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
                color: "white",
              }}
            >
              <Avatar
                size={32}
                style={{ backgroundColor: "#D93E4C", marginRight: "8px" }}
                icon={<UserOutlined />}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {managerName}
              </Text>
            </div>
          )}

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              width: "100%",
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Đăng xuất"}
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default ManagerSidebar;
