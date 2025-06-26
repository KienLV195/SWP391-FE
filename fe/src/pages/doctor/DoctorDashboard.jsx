import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import authService from "../../services/authService";
import {
  BLOOD_GROUPS,
  URGENCY_LEVELS,
  DOCTOR_TYPES,
} from "../../services/mockData";
import "../../styles/pages/DoctorDashboard.scss";
import WelcomeBanner from "../../components/doctor/dashboard/WelcomeBanner";
import StatisticsCards from "../../components/doctor/dashboard/StatisticsCards";
import ChartsSection from "../../components/doctor/dashboard/ChartsSection";
import NotificationsPanel from "../../components/doctor/dashboard/NotificationsPanel";

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    myRequests: [],
    recentActivity: [],
    bloodInventory: [],
    notifications: [],
  });

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Mock dashboard data
    const mockData = {
      myRequests: [
        {
          requestID: 1,
          bloodType: "O+",
          quantity: 2,
          urgencyLevel: URGENCY_LEVELS.URGENT,
          status: isBloodDepartment ? "approved" : "pending",
          createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reason: "Phẫu thuật khẩn cấp",
        },
        {
          requestID: 2,
          bloodType: "A-",
          quantity: 1,
          urgencyLevel: URGENCY_LEVELS.NORMAL,
          status: "approved",
          createdTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reason: "Điều trị ung thư",
        },
      ],
      recentActivity: [
        {
          id: 1,
          type: "request_created",
          message: "Tạo yêu cầu máu O+ - 2 đơn vị",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          type: "request_approved",
          message: "Yêu cầu máu A- đã được duyệt",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          type: "notification",
          message: "Thông báo: Thiếu máu O- khẩn cấp",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
      ],
      bloodInventory: [
        { bloodType: "O+", quantity: 45, status: "normal" },
        { bloodType: "O-", quantity: 8, status: "low" },
        { bloodType: "A+", quantity: 32, status: "normal" },
        { bloodType: "A-", quantity: 12, status: "normal" },
        { bloodType: "B+", quantity: 28, status: "normal" },
        { bloodType: "B-", quantity: 5, status: "critical" },
        { bloodType: "AB+", quantity: 15, status: "normal" },
        { bloodType: "AB-", quantity: 3, status: "critical" },
      ],
      notifications: [
        {
          id: 1,
          title: "Thiếu máu O- khẩn cấp",
          message: "Kho máu đang thiếu máu O- nghiêm trọng",
          type: "emergency",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: false,
        },
        {
          id: 2,
          title: "Cập nhật quy trình mới",
          message: "Quy trình yêu cầu máu đã được cập nhật",
          type: "info",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
      ],
    };

    setDashboardData(mockData);
  }, [isBloodDepartment]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "processing":
        return "info";
      case "completed":
        return "primary";
      default:
        return "secondary";
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "success";
      case "low":
        return "warning";
      case "critical":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "request_created":
        return "📝";
      case "request_approved":
        return "✅";
      case "notification":
        return "🔔";
      default:
        return "📋";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "emergency":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <DoctorLayout pageTitle="🏥 Dashboard Bác sĩ">
      <div className="doctor-dashboard-content">
        {/* Welcome Banner */}
        <WelcomeBanner doctorName={currentUser?.name || "Bác sĩ"} />

        {/* Statistics Cards */}
        <StatisticsCards
          statistics={{
            myRequests: dashboardData.myRequests.length,
            pendingRequests: dashboardData.myRequests.filter(
              (r) => r.status === "pending"
            ).length,
            urgentNotifications: dashboardData.notifications.filter(
              (n) => n.type === "emergency" && !n.isRead
            ).length,
          }}
        />

        {/* Charts Section */}
        <ChartsSection
          bloodGroupData={dashboardData.bloodInventory.map((item) => ({
            name: item.bloodType,
            value: item.quantity,
            status: item.status,
          }))}
          monthlyRequestsData={[
            { month: "T7", requests: 12 },
            { month: "T8", requests: 15 },
            { month: "T9", requests: 10 },
            { month: "T10", requests: 18 },
            { month: "T11", requests: 14 },
            { month: "T12", requests: 20 },
          ]}
        />

        {/* Notifications Panel */}
        <NotificationsPanel notifications={dashboardData.notifications} />
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
