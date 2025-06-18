import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Progress,
  List,
  Avatar,
  Typography,
} from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  UserOutlined,
  HeartOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import ManagerLayout from "../../components/manager/ManagerLayout";
import WelcomeBanner from "../../components/manager/dashboard/WelcomeBanner";
import StatisticsCards from "../../components/manager/dashboard/StatisticsCards";
import ChartsSection from "../../components/manager/dashboard/ChartsSection";
import NotificationsPanel from "../../components/manager/dashboard/NotificationsPanel";
import authService from "../../services/authService";
import { getUserName } from "../../utils/userUtils";
import {
  mockBloodRequests,
  mockUsers,
  REQUEST_STATUS,
  getBloodInventoryWithStatus,
} from "../../services/mockData";
import "../../styles/base/manager-design-system.scss";

const { Title, Text } = Typography;

const ManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    totalBloodUnits: 0,
    totalRequests: 0,
    bloodInventory: [],
    recentDonations: [],
    upcomingAppointments: [],
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    // Calculate statistics from mock data
    const members = mockUsers.filter((user) => user.role === "member");
    const donorsWithHistory = members.filter(
      (user) =>
        user.activityHistory &&
        user.activityHistory.some((activity) => activity.type === "donation")
    );

    // Get blood inventory with status
    const bloodInventory = getBloodInventoryWithStatus();

    // Calculate total blood units
    const totalBloodUnits = bloodInventory.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Prepare blood group data for pie chart
    const bloodGroupData = bloodInventory.map((item) => ({
      name: item.bloodType,
      value: item.quantity,
      status: item.status,
    }));

    // Mock monthly requests data for line chart
    const monthlyRequestsData = [
      { month: "T7", requests: 45 },
      { month: "T8", requests: 52 },
      { month: "T9", requests: 38 },
      { month: "T10", requests: 61 },
      { month: "T11", requests: 49 },
      { month: "T12", requests: 67 },
    ];

    setDashboardData({
      totalDonors: donorsWithHistory.length,
      totalRecipients: members.length,
      totalBloodUnits,
      totalRequests: mockBloodRequests.length,
      bloodInventory,
      bloodGroupData,
      monthlyRequestsData,
      notifications: [], // Will use default notifications from component
    });
  };

  // Navigation handlers can be added here if needed

  if (!user) {
    return <div>Loading...</div>;
  }

  const managerName = getUserName();

  return (
    <ManagerLayout>
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <WelcomeBanner managerName={managerName} />

        {/* Statistics Cards */}
        <StatisticsCards
          statistics={{
            totalBloodUnits: dashboardData.totalBloodUnits,
            totalDonors: dashboardData.totalDonors,
            totalRequests: dashboardData.totalRequests,
          }}
        />

        {/* Charts Section */}
        <ChartsSection
          bloodGroupData={dashboardData.bloodGroupData}
          monthlyRequestsData={dashboardData.monthlyRequestsData}
        />

        {/* Notifications Panel */}
        <NotificationsPanel notifications={dashboardData.notifications} />
      </div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
