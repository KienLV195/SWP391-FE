import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Modal,
  Steps,
  Tag,
  Row,
  Col,
  Divider,
  message,
  Tooltip,
  Badge,
  Space,
  Tabs,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import PageHeader from "../../components/manager/PageHeader";
import ProcessWorkflowModal, {
  DONATION_STATUSES,
} from "../../components/shared/ProcessWorkflowModal";
import authService from "../../services/authService";
import "../../styles/pages/DonationSchedulePage.scss";
import "../../styles/components/PageHeader.scss";

const { Option } = Select;
const { TabPane } = Tabs;

const DonationSchedulePageNew = () => {
  const [activeTab, setActiveTab] = useState("1"); // "1" for schedule, "2" for process
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [scheduleSort, setScheduleSort] = useState({
    field: "appointmentDate",
    order: "desc",
  });
  const [processSort, setProcessSort] = useState({
    field: "status",
    order: "asc",
  });
  const [filters, setFilters] = useState({
    bloodType: "all",
    status: "all",
  });

  const currentUser = authService.getCurrentUser();
  const isManager = currentUser?.role === "manager";

  useEffect(() => {
    loadAllDonations();
  }, []);

  const loadAllDonations = async () => {
    setLoading(true);
    try {
      // TODO_API_REPLACE: Replace with actual API call - GET /api/manager/donations
      const mockDonations = [
        {
          id: 1,
          donorId: 101,
          donorName: "Nguyễn Văn An",
          donorPhone: "0123456789",
          donorEmail: "nguyenvana@email.com",
          bloodType: "O+",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-15T08:00:00Z",
          appointmentDate: "2024-12-20",
          timeSlot: "morning",
          status: DONATION_STATUSES.REGISTERED,
          notificationStatus: "sent", // "sent", "pending", "failed"
          notificationSentAt: "2024-12-19T08:00:00Z",
          healthSurvey: {
            weight: 65,
            height: 170,
            bloodPressure: "120/80",
            eligibilityChecked: true,
          },
          location: {
            address: "120 Đường ABC, Quận 1, TP.HCM",
            distance: 0.5,
          },
          notes: "Người hiến lần đầu",
        },
        {
          id: 2,
          donorId: 102,
          donorName: "Trần Thị Bình",
          donorPhone: "0345678901",
          donorEmail: "tranthib@email.com",
          bloodType: "A+",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-14T14:30:00Z",
          appointmentDate: "2024-12-21",
          timeSlot: "afternoon",
          status: DONATION_STATUSES.HEALTH_CHECKED,
          healthSurvey: {
            weight: 55,
            height: 160,
            bloodPressure: "110/70",
            eligibilityChecked: true,
          },
          location: {
            address: "456 Đường XYZ, Quận 3, TP.HCM",
            distance: 5.2,
          },
          notes: "Đã hoàn thành khám sức khỏe",
        },
        {
          id: 3,
          donorId: 103,
          donorName: "Lê Văn Cường",
          donorPhone: "0789012345",
          donorEmail: "levanc@email.com",
          bloodType: "O-",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-13T10:15:00Z",
          appointmentDate: "2024-12-22",
          timeSlot: "morning",
          status: DONATION_STATUSES.DONATED,
          healthSurvey: {
            weight: 70,
            height: 175,
            bloodPressure: "125/85",
            eligibilityChecked: true,
          },
          location: {
            address: "789 Đường GHI, Quận 7, TP.HCM",
            distance: 15.3,
          },
          notes: "Đã hiến máu thành công, chờ xét nghiệm",
        },
        {
          id: 4,
          donorId: 104,
          donorName: "Phạm Thị Dung",
          donorPhone: "0567890123",
          donorEmail: "phamthid@email.com",
          bloodType: "AB+",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-12T16:45:00Z",
          appointmentDate: "2024-12-18",
          timeSlot: "afternoon",
          status: DONATION_STATUSES.COMPLETED,
          healthSurvey: {
            weight: 52,
            height: 158,
            bloodPressure: "115/75",
            eligibilityChecked: true,
          },
          location: {
            address: "321 Đường DEF, Quận 5, TP.HCM",
            distance: 8.7,
          },
          notes: "Hoàn thành quy trình, sẵn sàng nhập kho",
        },
        {
          id: 5,
          donorId: 105,
          donorName: "Hoàng Minh Tuấn",
          donorPhone: "0912345678",
          donorEmail: "hoangminhtuan@email.com",
          bloodType: "B+",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-16T09:00:00Z",
          appointmentDate: "2024-12-25", // Christmas day - should trigger reminder on 24th
          timeSlot: "morning",
          status: DONATION_STATUSES.REGISTERED,
          notificationStatus: "pending",
          notificationSentAt: null,
          healthSurvey: {
            weight: 68,
            height: 172,
            bloodPressure: "118/78",
            eligibilityChecked: true,
          },
          location: {
            address: "555 Đường MNO, Quận 10, TP.HCM",
            distance: 3.2,
          },
          notes: "Đã hiến máu 2 lần trước đây",
        },
        {
          id: 6,
          donorId: 106,
          donorName: "Nguyễn Thị Lan",
          donorPhone: "0987654321",
          donorEmail: "nguyenthilan@email.com",
          bloodType: "AB-",
          expectedQuantity: "450ml",
          registrationDate: "2024-12-11T11:20:00Z",
          appointmentDate: "2024-12-19",
          timeSlot: "afternoon",
          status: DONATION_STATUSES.BLOOD_TESTED,
          healthSurvey: {
            weight: 58,
            height: 165,
            bloodPressure: "112/72",
            eligibilityChecked: true,
          },
          location: {
            address: "888 Đường PQR, Quận Bình Thạnh, TP.HCM",
            distance: 7.8,
          },
          notes: "Xét nghiệm máu đạt tiêu chuẩn",
        },
      ];

      setAllDonations(mockDonations);
    } catch (error) {
      console.error("Error loading donations:", error);
      message.error("Có lỗi xảy ra khi tải danh sách hiến máu!");
    } finally {
      setLoading(false);
    }
  };

  // Filter donations for schedule tab (only registered)
  const getScheduleDonations = () => {
    let filtered = allDonations.filter(
      (d) => d.status === DONATION_STATUSES.REGISTERED
    );

    if (filters.bloodType !== "all") {
      filtered = filtered.filter((d) => d.bloodType === filters.bloodType);
    }

    // Sort donations
    return filtered.sort((a, b) => {
      const { field, order } = scheduleSort;
      let aValue, bValue;

      switch (field) {
        case "registrationDate":
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        case "bloodType":
          aValue = a.bloodType;
          bValue = b.bloodType;
          break;
        case "expectedQuantity":
          aValue = parseInt(a.expectedQuantity);
          bValue = parseInt(b.expectedQuantity);
          break;
        default:
          aValue = a[field];
          bValue = b[field];
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Filter donations for process tab (exclude registered)
  const getProcessDonations = () => {
    let filtered = allDonations.filter(
      (d) => d.status !== DONATION_STATUSES.REGISTERED
    );

    if (filters.bloodType !== "all") {
      filtered = filtered.filter((d) => d.bloodType === filters.bloodType);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((d) => d.status === filters.status);
    }

    // Sort donations
    return filtered.sort((a, b) => {
      const { field, order } = processSort;
      let aValue, bValue;

      switch (field) {
        case "status": {
          // Sort by process order
          const statusOrder = {
            [DONATION_STATUSES.HEALTH_CHECKED]: 1,
            [DONATION_STATUSES.ELIGIBLE]: 2,
            [DONATION_STATUSES.NOT_ELIGIBLE]: 2,
            [DONATION_STATUSES.DONATED]: 3,
            [DONATION_STATUSES.BLOOD_TESTED]: 4,
            [DONATION_STATUSES.COMPLETED]: 5,
            [DONATION_STATUSES.STORED]: 6,
          };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        }
        case "registrationDate":
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        case "appointmentDate":
          aValue = new Date(a.appointmentDate);
          bValue = new Date(b.appointmentDate);
          break;
        case "bloodType":
          aValue = a.bloodType;
          bValue = b.bloodType;
          break;
        default:
          aValue = a[field];
          bValue = b[field];
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Handle store blood action
  const handleStoreBlood = async (donationId) => {
    try {
      // TODO_API_REPLACE: Replace with actual API call - POST /api/manager/store-blood/:id
      setAllDonations((prev) =>
        prev.map((d) =>
          d.id === donationId ? { ...d, status: DONATION_STATUSES.STORED } : d
        )
      );
      message.success("Đã nhập kho thành công!");
    } catch (error) {
      console.error("Error storing blood:", error);
      message.error("Có lỗi xảy ra khi nhập kho!");
    }
  };

  // Auto notification system
  const checkAndSendReminders = useCallback(async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(23, 59, 59, 999);

      // Find donations with appointment tomorrow and status REGISTERED
      const donationsToRemind = allDonations.filter((donation) => {
        if (donation.status !== DONATION_STATUSES.REGISTERED) return false;
        if (donation.notificationStatus === "sent") return false;

        const appointmentDate = new Date(donation.appointmentDate);
        return appointmentDate >= tomorrow && appointmentDate <= tomorrowEnd;
      });

      // Send notifications
      for (const donation of donationsToRemind) {
        try {
          // TODO_API_REPLACE: Replace with actual API call - POST /api/notifications/send-reminder
          const notificationData = {
            to: donation.donorEmail,
            phone: donation.donorPhone,
            subject: "Nhắc nhở lịch hiến máu - Bệnh viện Ánh Dương",
            content: `Nhắc nhở: Bạn có lịch hiến máu vào ${new Date(
              donation.appointmentDate
            ).toLocaleDateString("vi-VN")} với loại máu ${
              donation.bloodType
            }. Vui lòng đến đúng giờ.`,
            type: "reminder",
            donationId: donation.id,
          };

          console.log("Sending reminder notification:", notificationData);

          // Update notification status
          setAllDonations((prev) =>
            prev.map((d) =>
              d.id === donation.id
                ? {
                    ...d,
                    notificationStatus: "sent",
                    notificationSentAt: new Date().toISOString(),
                  }
                : d
            )
          );

          message.success(`Đã gửi nhắc nhở đến ${donation.donorName}!`);
        } catch (error) {
          console.error(
            `Error sending reminder to ${donation.donorName}:`,
            error
          );

          // Update notification status to failed
          setAllDonations((prev) =>
            prev.map((d) =>
              d.id === donation.id ? { ...d, notificationStatus: "failed" } : d
            )
          );
        }
      }

      if (donationsToRemind.length === 0) {
        console.log("No reminders to send today");
      }
    } catch (error) {
      console.error("Error in auto reminder system:", error);
    }
  }, [allDonations]);

  // Setup reminder system
  useEffect(() => {
    // Set up daily reminder check (runs every 24 hours)
    const reminderInterval = setInterval(
      checkAndSendReminders,
      24 * 60 * 60 * 1000
    );

    // Run initial check after 5 seconds
    const initialCheck = setTimeout(checkAndSendReminders, 5000);

    return () => {
      clearInterval(reminderInterval);
      clearTimeout(initialCheck);
    };
  }, [checkAndSendReminders]);

  // Manual send reminder
  const handleSendReminder = async (donation) => {
    try {
      // TODO_API_REPLACE: Replace with actual API call - POST /api/notifications/send-reminder
      const notificationData = {
        to: donation.donorEmail,
        phone: donation.donorPhone,
        subject: "Nhắc nhở lịch hiến máu - Bệnh viện Ánh Dương",
        content: `Nhắc nhở: Bạn có lịch hiến máu vào ${new Date(
          donation.appointmentDate
        ).toLocaleDateString("vi-VN")} với loại máu ${
          donation.bloodType
        }. Vui lòng đến đúng giờ.`,
        type: "manual_reminder",
        donationId: donation.id,
      };

      console.log("Sending manual reminder:", notificationData);

      // Update notification status
      setAllDonations((prev) =>
        prev.map((d) =>
          d.id === donation.id
            ? {
                ...d,
                notificationStatus: "sent",
                notificationSentAt: new Date().toISOString(),
              }
            : d
        )
      );

      message.success(`Đã gửi lại nhắc nhở đến ${donation.donorName}!`);
    } catch (error) {
      console.error("Error sending manual reminder:", error);
      message.error("Có lỗi xảy ra khi gửi nhắc nhở!");
    }
  };

  // Get status info for display (simplified version for table rendering)
  const getStatusInfo = (status) => {
    const statusMap = {
      [DONATION_STATUSES.REGISTERED]: {
        text: "Đã đăng ký",
        color: "#1890ff",
        icon: <UserOutlined />,
      },
      [DONATION_STATUSES.HEALTH_CHECKED]: {
        text: "Đã khám sức khỏe",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
      },
      [DONATION_STATUSES.ELIGIBLE]: {
        text: "Đủ điều kiện",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
      },
      [DONATION_STATUSES.NOT_ELIGIBLE]: {
        text: "Không đủ điều kiện",
        color: "#ff4d4f",
        icon: <ExclamationCircleOutlined />,
      },
      [DONATION_STATUSES.DONATED]: {
        text: "Đã hiến máu",
        color: "#722ed1",
        icon: <HeartOutlined />,
      },
      [DONATION_STATUSES.BLOOD_TESTED]: {
        text: "Đã xét nghiệm",
        color: "#fa8c16",
        icon: <ClockCircleOutlined />,
      },
      [DONATION_STATUSES.COMPLETED]: {
        text: "Hoàn thành",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
      },
      [DONATION_STATUSES.STORED]: {
        text: "Đã nhập kho",
        color: "#13c2c2",
        icon: <CheckCircleOutlined />,
      },
    };
    return statusMap[status] || statusMap[DONATION_STATUSES.REGISTERED];
  };

  return (
    <div className="donation-schedule-page">
      <ManagerSidebar />
      <div className="schedule-content">
        {/* Page Header */}
        <PageHeader
          title="Lịch & Quy trình hiến máu"
          description="Quản lý lịch hẹn và theo dõi quy trình hiến máu"
          icon={CalendarOutlined}
          actions={[
            {
              label: "Làm mới",
              type: "primary",
              icon: <ReloadOutlined />,
              onClick: loadAllDonations,
              loading: loading,
            },
          ]}
        />

        {/* Main Content with Tabs */}
        <div className="main-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            type="card"
          >
            <TabPane
              tab={
                <span>
                  <CalendarOutlined />
                  Lịch hiến máu
                </span>
              }
              key="1"
            >
              <div className="schedule-tab-content">
                {/* Filters for Schedule Tab */}
                <Card className="filters-card">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <div className="filter-group">
                        <label>Nhóm máu:</label>
                        <Select
                          value={filters.bloodType}
                          onChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              bloodType: value,
                            }))
                          }
                          style={{ width: "100%" }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="A+">A+</Option>
                          <Option value="A-">A-</Option>
                          <Option value="B+">B+</Option>
                          <Option value="B-">B-</Option>
                          <Option value="AB+">AB+</Option>
                          <Option value="AB-">AB-</Option>
                          <Option value="O+">O+</Option>
                          <Option value="O-">O-</Option>
                        </Select>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="filter-group">
                        <label>Sắp xếp theo:</label>
                        <Select
                          value={`${scheduleSort.field}-${scheduleSort.order}`}
                          onChange={(value) => {
                            const [field, order] = value.split("-");
                            setScheduleSort({ field, order });
                          }}
                          style={{ width: "100%" }}
                        >
                          <Option value="appointmentDate-desc">
                            Ngày hẹn (mới nhất)
                          </Option>
                          <Option value="appointmentDate-asc">
                            Ngày hẹn (cũ nhất)
                          </Option>
                          <Option value="bloodType-asc">Loại máu (A-Z)</Option>
                          <Option value="bloodType-desc">Loại máu (Z-A)</Option>
                          <Option value="expectedQuantity-asc">
                            Lượng máu (tăng dần)
                          </Option>
                          <Option value="expectedQuantity-desc">
                            Lượng máu (giảm dần)
                          </Option>
                        </Select>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Schedule Donations Table */}
                <Card className="donations-table-card">
                  <Table
                    dataSource={getScheduleDonations()}
                    columns={[
                      {
                        title: "Ngày hẹn",
                        dataIndex: "appointmentDate",
                        key: "appointmentDate",
                        width: 130,
                        sorter: true,
                        render: (date) =>
                          new Date(date).toLocaleDateString("vi-VN"),
                      },
                      {
                        title: "Nhóm máu",
                        dataIndex: "bloodType",
                        key: "bloodType",
                        width: 100,
                        align: "center",
                        sorter: true,
                        render: (bloodType) => (
                          <Tag color="#D93E4C" style={{ fontWeight: "bold" }}>
                            {bloodType}
                          </Tag>
                        ),
                      },
                      {
                        title: "Lượng máu dự kiến",
                        dataIndex: "expectedQuantity",
                        key: "expectedQuantity",
                        width: 150,
                        align: "center",
                        sorter: true,
                        render: (quantity) => (
                          <span style={{ fontWeight: 600, color: "#20374E" }}>
                            {quantity}
                          </span>
                        ),
                      },
                      {
                        title: "Tên người hiến",
                        dataIndex: "donorName",
                        key: "donorName",
                        width: 180,
                        render: (text, record) => (
                          <div>
                            <div style={{ fontWeight: 600 }}>{text}</div>
                            <div style={{ fontSize: "0.8rem", color: "#666" }}>
                              ID: {record.donorId}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Trạng thái thông báo",
                        dataIndex: "notificationStatus",
                        key: "notificationStatus",
                        width: 160,
                        align: "center",
                        render: (status, record) => {
                          const statusMap = {
                            sent: { text: "Đã gửi nhắc nhở", color: "#52c41a" },
                            pending: { text: "Chưa gửi", color: "#faad14" },
                            failed: { text: "Gửi thất bại", color: "#ff4d4f" },
                          };
                          const statusInfo =
                            statusMap[status] || statusMap.pending;
                          return (
                            <div>
                              <Tag
                                color={statusInfo.color}
                                style={{ marginBottom: 4 }}
                              >
                                {statusInfo.text}
                              </Tag>
                              {status === "sent" &&
                                record.notificationSentAt && (
                                  <div
                                    style={{
                                      fontSize: "0.7rem",
                                      color: "#666",
                                    }}
                                  >
                                    {new Date(
                                      record.notificationSentAt
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                )}
                            </div>
                          );
                        },
                      },
                      {
                        title: "Hành động",
                        key: "actions",
                        width: 150,
                        render: (_, record) => (
                          <Space>
                            <Tooltip title="Xem chi tiết">
                              <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => {
                                  setSelectedDonation(record);
                                  setDetailModalVisible(true);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Quy trình hiến máu">
                              <Button
                                type="default"
                                icon={<ClockCircleOutlined />}
                                size="small"
                                onClick={() => {
                                  setSelectedDonation(record);
                                  setProcessModalVisible(true);
                                }}
                              />
                            </Tooltip>
                          </Space>
                        ),
                      },
                    ]}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} lịch hẹn`,
                    }}
                    scroll={{ x: 800 }}
                    onChange={(pagination, filters, sorter) => {
                      if (sorter.field) {
                        setScheduleSort({
                          field: sorter.field,
                          order: sorter.order === "ascend" ? "asc" : "desc",
                        });
                      }
                    }}
                  />
                </Card>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HeartOutlined />
                  Quy trình xử lý
                </span>
              }
              key="2"
            >
              <div className="process-tab-content">
                {/* Filters for Process Tab */}
                <Card className="filters-card">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <div className="filter-group">
                        <label>Trạng thái:</label>
                        <Select
                          value={filters.status}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, status: value }))
                          }
                          style={{ width: "100%" }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value={DONATION_STATUSES.HEALTH_CHECKED}>
                            Kiểm tra sức khỏe
                          </Option>
                          <Option value={DONATION_STATUSES.DONATED}>
                            Hiến máu
                          </Option>
                          <Option value={DONATION_STATUSES.BLOOD_TESTED}>
                            Xét nghiệm máu
                          </Option>
                          <Option value={DONATION_STATUSES.COMPLETED}>
                            Hoàn thành
                          </Option>
                        </Select>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="filter-group">
                        <label>Nhóm máu:</label>
                        <Select
                          value={filters.bloodType}
                          onChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              bloodType: value,
                            }))
                          }
                          style={{ width: "100%" }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="A+">A+</Option>
                          <Option value="A-">A-</Option>
                          <Option value="B+">B+</Option>
                          <Option value="B-">B-</Option>
                          <Option value="AB+">AB+</Option>
                          <Option value="AB-">AB-</Option>
                          <Option value="O+">O+</Option>
                          <Option value="O-">O-</Option>
                        </Select>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="filter-group">
                        <label>Sắp xếp theo:</label>
                        <Select
                          value={`${processSort.field}-${processSort.order}`}
                          onChange={(value) => {
                            const [field, order] = value.split("-");
                            setProcessSort({ field, order });
                          }}
                          style={{ width: "100%" }}
                        >
                          <Option value="status-asc">
                            Trạng thái (theo quy trình)
                          </Option>
                          <Option value="appointmentDate-desc">
                            Ngày hẹn (mới nhất)
                          </Option>
                          <Option value="appointmentDate-asc">
                            Ngày hẹn (cũ nhất)
                          </Option>
                          <Option value="bloodType-asc">Loại máu (A-Z)</Option>
                          <Option value="bloodType-desc">Loại máu (Z-A)</Option>
                        </Select>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Process Donations Table */}
                <Card className="process-donations-card">
                  <Table
                    dataSource={getProcessDonations()}
                    columns={[
                      {
                        title: "Ngày hẹn",
                        dataIndex: "appointmentDate",
                        key: "appointmentDate",
                        width: 130,
                        sorter: true,
                        render: (date) =>
                          new Date(date).toLocaleDateString("vi-VN"),
                      },
                      {
                        title: "Nhóm máu",
                        dataIndex: "bloodType",
                        key: "bloodType",
                        width: 100,
                        align: "center",
                        sorter: true,
                        render: (bloodType) => (
                          <Tag color="#D93E4C" style={{ fontWeight: "bold" }}>
                            {bloodType}
                          </Tag>
                        ),
                      },
                      {
                        title: "Lượng máu dự kiến",
                        dataIndex: "expectedQuantity",
                        key: "expectedQuantity",
                        width: 150,
                        align: "center",
                        render: (quantity) => (
                          <span style={{ fontWeight: 600, color: "#20374E" }}>
                            {quantity}
                          </span>
                        ),
                      },
                      {
                        title: "Tên người hiến",
                        dataIndex: "donorName",
                        key: "donorName",
                        width: 180,
                        render: (text, record) => (
                          <div>
                            <div style={{ fontWeight: 600 }}>{text}</div>
                            <div style={{ fontSize: "0.8rem", color: "#666" }}>
                              ID: {record.donorId}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Trạng thái hiện tại",
                        dataIndex: "status",
                        key: "status",
                        width: 180,
                        sorter: true,
                        render: (status) => {
                          const statusInfo = getStatusInfo(status);
                          return (
                            <Tag
                              color={statusInfo.color}
                              icon={statusInfo.icon}
                              style={{ fontWeight: 600 }}
                            >
                              {statusInfo.text}
                            </Tag>
                          );
                        },
                      },
                      {
                        title: "Hành động",
                        key: "actions",
                        width: 220,
                        render: (_, record) => (
                          <Space>
                            <Tooltip title="Xem chi tiết">
                              <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => {
                                  setSelectedDonation(record);
                                  setDetailModalVisible(true);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Quy trình hiến máu">
                              <Button
                                type="default"
                                icon={<ClockCircleOutlined />}
                                size="small"
                                onClick={() => {
                                  setSelectedDonation(record);
                                  setProcessModalVisible(true);
                                }}
                              />
                            </Tooltip>
                            {isManager &&
                              record.status === DONATION_STATUSES.COMPLETED && (
                                <Tooltip title="Nhập kho">
                                  <Button
                                    type="default"
                                    style={{
                                      backgroundColor: "#52c41a",
                                      borderColor: "#52c41a",
                                      color: "white",
                                    }}
                                    size="small"
                                    onClick={() => handleStoreBlood(record.id)}
                                  >
                                    Nhập kho
                                  </Button>
                                </Tooltip>
                              )}
                          </Space>
                        ),
                      },
                    ]}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} quy trình`,
                    }}
                    scroll={{ x: 1100 }}
                    onChange={(pagination, filters, sorter) => {
                      if (sorter.field) {
                        setProcessSort({
                          field: sorter.field,
                          order: sorter.order === "ascend" ? "asc" : "desc",
                        });
                      }
                    }}
                  />
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Process Workflow Modal */}
        <ProcessWorkflowModal
          visible={processModalVisible}
          onCancel={() => setProcessModalVisible(false)}
          selectedItem={selectedDonation}
          onStoreBlood={handleStoreBlood}
          isManager={isManager}
          title="Quy trình hiến máu"
        />

        {/* Detail Modal */}
        <Modal
          title={`Chi tiết lịch hẹn: ${selectedDonation?.donorName}`}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
            selectedDonation?.status === DONATION_STATUSES.REGISTERED && (
              <Button
                key="send-reminder"
                type="primary"
                onClick={() => {
                  handleSendReminder(selectedDonation);
                  setDetailModalVisible(false);
                }}
              >
                Gửi lại thông báo
              </Button>
            ),
          ]}
          width={700}
        >
          {selectedDonation && (
            <div className="donation-details">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Họ tên:</strong> {selectedDonation.donorName}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>ID người hiến:</strong> {selectedDonation.donorId}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Nhóm máu:</strong>
                    <Tag color="#D93E4C" style={{ marginLeft: 8 }}>
                      {selectedDonation.bloodType}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Số điện thoại:</strong>
                    <a
                      href={`tel:${selectedDonation.donorPhone}`}
                      style={{ marginLeft: 8 }}
                    >
                      {selectedDonation.donorPhone}
                    </a>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <a
                      href={`mailto:${selectedDonation.donorEmail}`}
                      style={{ marginLeft: 8 }}
                    >
                      {selectedDonation.donorEmail}
                    </a>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Ngày đăng ký:</strong>{" "}
                    {selectedDonation.registrationDate
                      ? new Date(
                          selectedDonation.registrationDate
                        ).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Lượng máu dự kiến:</strong>{" "}
                    <span style={{ fontWeight: 600, color: "#20374E" }}>
                      {selectedDonation.expectedQuantity || "450ml"}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Ngày hẹn:</strong>{" "}
                    {selectedDonation.appointmentDate
                      ? new Date(
                          selectedDonation.appointmentDate
                        ).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Ca hiến:</strong>{" "}
                    {selectedDonation.timeSlot === "morning"
                      ? "Sáng (7:00-11:00)"
                      : "Chiều (13:00-17:00)"}
                  </div>
                </Col>
                <Col span={24}>
                  <div className="detail-item">
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedDonation.location?.address || "Chưa có"}
                  </div>
                </Col>
                {selectedDonation.healthSurvey && (
                  <>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Cân nặng:</strong>{" "}
                        {selectedDonation.healthSurvey.weight} kg
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Chiều cao:</strong>{" "}
                        {selectedDonation.healthSurvey.height} cm
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Huyết áp:</strong>{" "}
                        {selectedDonation.healthSurvey.bloodPressure}
                      </div>
                    </Col>
                  </>
                )}
                {selectedDonation.status === DONATION_STATUSES.REGISTERED && (
                  <>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Trạng thái thông báo:</strong>{" "}
                        {(() => {
                          const statusMap = {
                            sent: { text: "Đã gửi nhắc nhở", color: "#52c41a" },
                            pending: { text: "Chưa gửi", color: "#faad14" },
                            failed: { text: "Gửi thất bại", color: "#ff4d4f" },
                          };
                          const statusInfo =
                            statusMap[selectedDonation.notificationStatus] ||
                            statusMap.pending;
                          return (
                            <Tag color={statusInfo.color}>
                              {statusInfo.text}
                            </Tag>
                          );
                        })()}
                      </div>
                    </Col>
                    {selectedDonation.notificationStatus === "sent" &&
                      selectedDonation.notificationSentAt && (
                        <Col span={12}>
                          <div className="detail-item">
                            <strong>Ngày gửi nhắc nhở:</strong>{" "}
                            {new Date(
                              selectedDonation.notificationSentAt
                            ).toLocaleDateString("vi-VN")}
                          </div>
                        </Col>
                      )}
                  </>
                )}
                <Col span={24}>
                  <div className="detail-item">
                    <strong>Ghi chú:</strong>{" "}
                    {selectedDonation.notes || "Không có ghi chú"}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DonationSchedulePageNew;
