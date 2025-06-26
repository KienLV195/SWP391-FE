import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Typography } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import authService from "../../services/authService";
import { getUserName } from "../../utils/userUtils";
import { DOCTOR_TYPES } from "../../services/mockData";
import "../../styles/base/manager-design-system.scss";

const { Sider } = Layout;
const { Text } = Typography;

const DoctorSidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  const navItems = [
    {
      key: "/doctor",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/doctor",
      exact: true,
    },
    {
      key: "/doctor/blood-requests",
      label: "Yêu cầu máu",
      icon: <FileTextOutlined />,
      path: "/doctor/blood-requests",
    },
    {
      key: "/doctor/blood-inventory",
      label: "Xem kho máu",
      icon: <TeamOutlined />,
      path: "/doctor/blood-inventory",
    },
  ];

  if (isBloodDepartment) {
    navItems.splice(2, 0, {
      key: "/doctor/donor-management",
      label: "Quản lý người hiến máu",
      icon: <UserOutlined />,
      path: "/doctor/donor-management",
    });
    navItems.push({
      key: "/doctor/blog",
      label: "Quản lý Blog",
      icon: <FileTextOutlined />,
      path: "/doctor/blog",
    });
  }

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

  const doctorName = getUserName();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sider
      className="admin-sidebar"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      collapsedWidth={80}
      trigger={null}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: "#20374E",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
                Ánh Dương
              </div>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Doctor Panel
              </Text>
              <div style={{ color: "#fff", fontSize: 13, marginTop: 8 }}>
                {isBloodDepartment ? "🩸 Khoa Huyết học" : "🏥 Khoa khác"}
              </div>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={menuItems}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "white",
            overflow: "auto",
          }}
          theme="dark"
        />

        {/* Footer */}
        <div
          style={{
            padding: collapsed ? "16px 8px" : "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "#20374E",
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
                {doctorName}
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

export default DoctorSidebar;
