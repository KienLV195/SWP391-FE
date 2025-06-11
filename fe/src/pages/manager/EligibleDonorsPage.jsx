import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Tooltip,
  message,
  Card,
  Steps,
  Row,
  Col,
  Switch,
  Badge,
  Divider,
} from "antd";
import {
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  TableOutlined,
  AppstoreOutlined,
  UserOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import PageHeader from "../../components/manager/PageHeader";
import ProcessWorkflowModal, {
  DONATION_STATUSES,
} from "../../components/shared/ProcessWorkflowModal";
import GeolibService from "../../services/geolibService";
import authService from "../../services/authService";
import "../../styles/pages/EligibleDonorsPage.scss";
import "../../styles/components/PageHeader.scss";

const { Option } = Select;
const { Search } = Input;

const EligibleDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [filters, setFilters] = useState({
    bloodType: "all",
    maxDistance: 50,
    searchText: "",
    sortBy: "distance",
    status: "all",
  });

  const currentUser = authService.getCurrentUser();

  // Hàm kiểm tra eligibility (84 ngày)
  const isEligibleToDonate = (lastDonationDate) => {
    if (!lastDonationDate) return true;

    const lastDonation = new Date(lastDonationDate);
    const currentDate = new Date();
    const daysDifference = Math.floor(
      (currentDate - lastDonation) / (1000 * 60 * 60 * 24)
    );

    return daysDifference >= 84;
  };

  // Format ngày theo DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa hiến";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get status info for display (simplified version for table rendering)
  const getStatusInfo = (status) => {
    const statusMap = {
      [DONATION_STATUSES.REGISTERED]: {
        text: "Đã đăng ký",
        color: "#1890ff",
        icon: <UserOutlined />,
        step: 0,
      },
      [DONATION_STATUSES.HEALTH_CHECKED]: {
        text: "Đã khám sức khỏe",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 1,
      },
      [DONATION_STATUSES.ELIGIBLE]: {
        text: "Đủ điều kiện",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 2,
      },
      [DONATION_STATUSES.NOT_ELIGIBLE]: {
        text: "Không đủ điều kiện",
        color: "#ff4d4f",
        icon: <ExclamationCircleOutlined />,
        step: 2,
      },
      [DONATION_STATUSES.DONATED]: {
        text: "Đã hiến máu",
        color: "#722ed1",
        icon: <HeartOutlined />,
        step: 3,
      },
      [DONATION_STATUSES.BLOOD_TESTED]: {
        text: "Đã xét nghiệm",
        color: "#fa8c16",
        icon: <ClockCircleOutlined />,
        step: 4,
      },
      [DONATION_STATUSES.COMPLETED]: {
        text: "Hoàn thành",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 5,
      },
      [DONATION_STATUSES.STORED]: {
        text: "Đã nhập kho",
        color: "#13c2c2",
        icon: <CheckCircleOutlined />,
        step: 6,
      },
    };
    return statusMap[status] || statusMap[DONATION_STATUSES.REGISTERED];
  };

  useEffect(() => {
    loadEligibleDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, filters]);

  const loadEligibleDonors = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/donors/eligible
      const mockDonors = [
        {
          id: 1,
          name: "Nguyễn Văn An",
          bloodType: "O+",
          phone: "0901234567",
          email: "an.nguyen@email.com",
          coordinates: { lat: 10.7769, lng: 106.7009 },
          address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
          lastDonationDate: "2024-08-15",
          totalDonations: 5,
          healthStatus: "excellent",
          age: 28,
          weight: 65,
          notes: "Người hiến tích cực, sức khỏe tốt",
          donationStatus: DONATION_STATUSES.REGISTERED,
          appointmentDate: "2024-12-20",
          timeSlot: "morning",
        },
        {
          id: 2,
          name: "Trần Thị Bình",
          bloodType: "A+",
          phone: "0987654321",
          email: "binh.tran@email.com",
          coordinates: { lat: 10.78, lng: 106.69 },
          address: "456 Lê Lợi, Quận 3, TP.HCM",
          lastDonationDate: "2024-07-20",
          totalDonations: 12,
          healthStatus: "good",
          age: 32,
          weight: 55,
          notes: "Người hiến kinh nghiệm",
          donationStatus: DONATION_STATUSES.HEALTH_CHECKED,
          appointmentDate: "2024-12-18",
          timeSlot: "afternoon",
        },
        {
          id: 3,
          name: "Lê Văn Cường",
          bloodType: "O-",
          phone: "0345678901",
          email: "cuong.le@email.com",
          coordinates: { lat: 10.8, lng: 106.7 },
          address: "789 Nguyễn Văn Linh, Quận 7, TP.HCM",
          lastDonationDate: "2024-06-30",
          totalDonations: 15,
          healthStatus: "excellent",
          age: 35,
          weight: 70,
          notes: "Máu hiếm O-, sẵn sàng hỗ trợ khẩn cấp",
          donationStatus: DONATION_STATUSES.DONATED,
          appointmentDate: "2024-12-15",
          timeSlot: "morning",
        },
        {
          id: 4,
          name: "Phạm Thị Dung",
          bloodType: "AB+",
          phone: "0567890123",
          email: "dung.pham@email.com",
          coordinates: { lat: 10.75, lng: 106.65 },
          address: "321 Trần Hưng Đạo, Quận 5, TP.HCM",
          lastDonationDate: "2024-11-20",
          totalDonations: 6,
          healthStatus: "good",
          age: 26,
          weight: 52,
          notes: "Vừa hiến máu gần đây",
          donationStatus: DONATION_STATUSES.COMPLETED,
          appointmentDate: "2024-12-10",
          timeSlot: "afternoon",
        },
        {
          id: 5,
          name: "Hoàng Văn Minh",
          bloodType: "B+",
          phone: "0789012345",
          email: "minh.hoang@email.com",
          coordinates: { lat: 10.7651, lng: 106.6818 },
          address: "555 Võ Văn Tần, Quận 3, TP.HCM",
          lastDonationDate: "2024-09-10",
          totalDonations: 8,
          healthStatus: "excellent",
          age: 30,
          weight: 68,
          notes: "Người hiến máu tích cực",
          donationStatus: DONATION_STATUSES.BLOOD_TESTED,
          appointmentDate: "2024-12-12",
          timeSlot: "morning",
        },
      ];

      // Lọc chỉ những người đủ điều kiện (84 ngày)
      const eligibleDonors = mockDonors
        .filter((donor) => isEligibleToDonate(donor.lastDonationDate))
        .map((donor) => {
          const distance = GeolibService.getDistanceToHospital(
            donor.coordinates
          );
          return {
            ...donor,
            distance,
            formattedLastDonation: formatDate(donor.lastDonationDate),
          };
        });

      setDonors(eligibleDonors);
    } catch (error) {
      console.error("Error loading eligible donors:", error);
      message.error("Có lỗi xảy ra khi tải danh sách người hiến máu!");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...donors];

    if (filters.bloodType !== "all") {
      filtered = filtered.filter(
        (donor) => donor.bloodType === filters.bloodType
      );
    }

    if (filters.maxDistance) {
      filtered = filtered.filter(
        (donor) => donor.distance <= filters.maxDistance
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (donor) => donor.donationStatus === filters.status
      );
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (donor) =>
          donor.name.toLowerCase().includes(searchLower) ||
          donor.phone.includes(filters.searchText) ||
          donor.email.toLowerCase().includes(searchLower)
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "lastDonation":
          return new Date(b.lastDonationDate) - new Date(a.lastDonationDate);
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return (
            getStatusInfo(a.donationStatus).step -
            getStatusInfo(b.donationStatus).step
          );
        default:
          return 0;
      }
    });

    setFilteredDonors(filtered);
  };

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setDetailModalVisible(true);
  };

  const handleViewProcess = (donor) => {
    setSelectedDonor(donor);
    setProcessModalVisible(true);
  };

  const handleUpdateStatus = async (donorId, newStatus) => {
    try {
      // TODO: Replace with actual API call - PUT /api/donors/:id/status
      setDonors((prev) =>
        prev.map((donor) =>
          donor.id === donorId ? { ...donor, donationStatus: newStatus } : donor
        )
      );
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const handleSendEmail = async (donor) => {
    try {
      // TODO: Replace with actual API call - POST /api/donors/send-email
      const emailData = {
        to: donor.email,
        subject: "Kêu gọi hiến máu - Bệnh viện Ánh Dương",
        content: `Kính chào ${donor.name}, Bệnh viện Ánh Dương hiện đang cần máu nhóm ${donor.bloodType} để cứu chữa bệnh nhân.`,
      };

      console.log("Sending email:", emailData);
      message.success(`Đã gửi email kêu gọi hiến máu đến ${donor.name}!`);
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Có lỗi xảy ra khi gửi email!");
    }
  };

  const handleStoreBlood = async (donorId) => {
    try {
      // TODO_API_REPLACE: Replace with actual API call - POST /api/manager/store-blood/:id
      await handleUpdateStatus(donorId, DONATION_STATUSES.STORED);
    } catch (error) {
      console.error("Error storing blood:", error);
      message.error("Có lỗi xảy ra khi nhập kho!");
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "O+": "#f50",
      "O-": "#ff4d4f",
      "A+": "#1890ff",
      "A-": "#096dd9",
      "B+": "#52c41a",
      "B-": "#389e0d",
      "AB+": "#722ed1",
      "AB-": "#531dab",
    };
    return colors[bloodType] || "#666";
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      width: 100,
      align: "center",
      render: (bloodType) => (
        <Tag
          color={getBloodTypeColor(bloodType)}
          style={{ fontWeight: "bold" }}
        >
          {bloodType}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "donationStatus",
      key: "donationStatus",
      width: 150,
      align: "center",
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Khoảng cách",
      dataIndex: "distance",
      key: "distance",
      width: 120,
      align: "center",
      sorter: (a, b) => a.distance - b.distance,
      render: (distance) => (
        <span
          style={{
            color:
              distance <= 10
                ? "#52c41a"
                : distance <= 20
                ? "#faad14"
                : "#ff4d4f",
          }}
        >
          {GeolibService.formatDistance(distance)}
        </span>
      ),
    },
    {
      title: "Lần hiến cuối",
      dataIndex: "formattedLastDonation",
      key: "lastDonation",
      width: 130,
      align: "center",
      sorter: (a, b) =>
        new Date(b.lastDonationDate) - new Date(a.lastDonationDate),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 140,
      render: (phone) => (
        <a href={`tel:${phone}`} style={{ color: "#1890ff" }}>
          <PhoneOutlined /> {phone}
        </a>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 220,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Quy trình hiến máu">
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              size="small"
              onClick={() => handleViewProcess(record)}
            />
          </Tooltip>
          <Tooltip title="Gửi email kêu gọi">
            <Button
              type="default"
              icon={<MailOutlined />}
              size="small"
              onClick={() => handleSendEmail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="eligible-donors-page">
      <ManagerSidebar />

      <div className="donors-content">
        <PageHeader
          title="Người hiến đủ điều kiện"
          description="Danh sách người hiến máu đã đủ 84 ngày kể từ lần hiến cuối"
          icon={UserOutlined}
          actions={[
            {
              label: (
                <div className="view-mode-toggle">
                  <span>Chế độ xem:</span>
                  <Switch
                    checkedChildren={<AppstoreOutlined />}
                    unCheckedChildren={<TableOutlined />}
                    checked={viewMode === "card"}
                    onChange={(checked) =>
                      setViewMode(checked ? "card" : "table")
                    }
                  />
                </div>
              ),
            },
            {
              label: "Làm mới",
              type: "primary",
              icon: <ReloadOutlined />,
              onClick: loadEligibleDonors,
              loading: loading,
            },
          ]}
        />

        {/* Filters */}
        <div className="filters-section">
          <Space wrap size="large">
            <div className="filter-group">
              <label>Tìm kiếm:</label>
              <Search
                placeholder="Tên, số điện thoại, email..."
                value={filters.searchText}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchText: e.target.value,
                  }))
                }
                style={{ width: 250 }}
                allowClear
              />
            </div>

            <div className="filter-group">
              <label>Nhóm máu:</label>
              <Select
                value={filters.bloodType}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, bloodType: value }))
                }
                style={{ width: 120 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Khoảng cách:</label>
              <Select
                value={filters.maxDistance}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, maxDistance: value }))
                }
                style={{ width: 120 }}
              >
                <Option value={5}>≤ 5km</Option>
                <Option value={10}>≤ 10km</Option>
                <Option value={20}>≤ 20km</Option>
                <Option value={50}>≤ 50km</Option>
                <Option value={100}>≤ 100km</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Trạng thái:</label>
              <Select
                value={filters.status}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value={DONATION_STATUSES.REGISTERED}>Đã đăng ký</Option>
                <Option value={DONATION_STATUSES.HEALTH_CHECKED}>
                  Đã khám
                </Option>
                <Option value={DONATION_STATUSES.DONATED}>Đã hiến máu</Option>
                <Option value={DONATION_STATUSES.COMPLETED}>Hoàn thành</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Sắp xếp:</label>
              <Select
                value={filters.sortBy}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
                style={{ width: 150 }}
              >
                <Option value="distance">Khoảng cách</Option>
                <Option value="lastDonation">Lần hiến cuối</Option>
                <Option value="name">Tên A-Z</Option>
                <Option value="status">Trạng thái</Option>
              </Select>
            </div>
          </Space>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span>
            Hiển thị <strong>{filteredDonors.length}</strong> người hiến đủ điều
            kiện
            {filters.bloodType !== "all" && ` (nhóm máu ${filters.bloodType})`}
            {filters.maxDistance && ` trong bán kính ${filters.maxDistance}km`}
          </span>
        </div>

        {/* Donors Display */}
        {viewMode === "table" ? (
          <div className="table-section">
            <Table
              columns={columns}
              dataSource={filteredDonors}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} người hiến`,
              }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </div>
        ) : (
          <div className="cards-section">
            <Row gutter={[16, 16]}>
              {filteredDonors.map((donor) => {
                const statusInfo = getStatusInfo(donor.donationStatus);
                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={donor.id}>
                    <Card
                      className="donor-card"
                      hoverable
                      actions={[
                        <Tooltip title="Xem chi tiết" key="detail">
                          <EyeOutlined
                            onClick={() => handleViewDetails(donor)}
                          />
                        </Tooltip>,
                        <Tooltip title="Quy trình hiến máu" key="process">
                          <ClockCircleOutlined
                            onClick={() => handleViewProcess(donor)}
                          />
                        </Tooltip>,
                        <Tooltip title="Gửi email" key="email">
                          <MailOutlined
                            onClick={() => handleSendEmail(donor)}
                          />
                        </Tooltip>,
                      ]}
                    >
                      <div className="card-header">
                        <div className="donor-name">{donor.name}</div>
                        <Tag
                          color={getBloodTypeColor(donor.bloodType)}
                          className="blood-type-tag"
                        >
                          {donor.bloodType}
                        </Tag>
                      </div>

                      <div className="card-content">
                        <div className="status-section">
                          <Badge
                            color={statusInfo.color}
                            text={statusInfo.text}
                            className="status-badge"
                          />
                        </div>

                        <div className="info-item">
                          <EnvironmentOutlined className="info-icon" />
                          <span className="distance-text">
                            {GeolibService.formatDistance(donor.distance)}
                          </span>
                        </div>

                        <div className="info-item">
                          <PhoneOutlined className="info-icon" />
                          <a href={`tel:${donor.phone}`} className="phone-link">
                            {donor.phone}
                          </a>
                        </div>

                        <div className="info-item">
                          <ClockCircleOutlined className="info-icon" />
                          <span>
                            Lần hiến cuối: {donor.formattedLastDonation}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {filteredDonors.length === 0 && !loading && (
              <div className="empty-state">
                <UserOutlined className="empty-icon" />
                <h3>Không tìm thấy người hiến nào</h3>
                <p>Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          title={`Chi tiết người hiến: ${selectedDonor?.name}`}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
            <Button
              key="email"
              type="primary"
              icon={<MailOutlined />}
              onClick={() => {
                handleSendEmail(selectedDonor);
                setDetailModalVisible(false);
              }}
            >
              Gửi email kêu gọi
            </Button>,
          ]}
          width={600}
        >
          {selectedDonor && (
            <div className="donor-details">
              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{selectedDonor.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nhóm máu:</label>
                    <Tag color={getBloodTypeColor(selectedDonor.bloodType)}>
                      {selectedDonor.bloodType}
                    </Tag>
                  </div>
                  <div className="detail-item">
                    <label>Tuổi:</label>
                    <span>{selectedDonor.age} tuổi</span>
                  </div>
                  <div className="detail-item">
                    <label>Cân nặng:</label>
                    <span>{selectedDonor.weight} kg</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thông tin liên hệ</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Số điện thoại:</label>
                    <a href={`tel:${selectedDonor.phone}`}>
                      <PhoneOutlined /> {selectedDonor.phone}
                    </a>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <a href={`mailto:${selectedDonor.email}`}>
                      <MailOutlined /> {selectedDonor.email}
                    </a>
                  </div>
                  <div className="detail-item full-width">
                    <label>Địa chỉ:</label>
                    <span>
                      <EnvironmentOutlined /> {selectedDonor.address}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Khoảng cách:</label>
                    <span>
                      {GeolibService.formatDistance(selectedDonor.distance)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Lịch sử hiến máu</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Lần hiến cuối:</label>
                    <span>{selectedDonor.formattedLastDonation}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tổng số lần hiến:</label>
                    <span>{selectedDonor.totalDonations} lần</span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <Tag
                      color={
                        selectedDonor.healthStatus === "excellent"
                          ? "green"
                          : "blue"
                      }
                    >
                      {selectedDonor.healthStatus === "excellent"
                        ? "Xuất sắc"
                        : "Tốt"}
                    </Tag>
                  </div>
                </div>
              </div>

              {selectedDonor.notes && (
                <div className="detail-section">
                  <h4>Ghi chú</h4>
                  <p>{selectedDonor.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Process Workflow Modal */}
        <ProcessWorkflowModal
          visible={processModalVisible}
          onCancel={() => setProcessModalVisible(false)}
          selectedItem={selectedDonor}
          onStoreBlood={handleStoreBlood}
          isManager={true}
          title="Quy trình hiến máu"
        />
      </div>
    </div>
  );
};

export default EligibleDonorsPage;
