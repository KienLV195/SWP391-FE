import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import authService from "../../services/authService";
import {
  BLOOD_GROUPS,
  COMPONENT_TYPES,
  DOCTOR_TYPES,
} from "../../services/mockData";
import "../../styles/pages/BloodInventoryViewPage.scss";
import "../../styles/pages/GuestHomePage.scss";
import { Card, Row, Col, Statistic, Select, Table, Tag } from "antd";
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

const BloodInventoryViewPage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: "all",
    component: "all",
    status: "all",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Mock blood inventory data
    const mockInventory = [
      {
        id: 1,
        bloodType: "O+",
        component: COMPONENT_TYPES.WHOLE,
        quantity: 45,
        unit: "đơn vị",
        expiryDate: "2024-12-25",
        status: "normal",
        location: "Kho A-1",
        lastUpdated: "2024-12-10T10:30:00",
        isRare: false,
      },
      {
        id: 2,
        bloodType: "O-",
        component: COMPONENT_TYPES.WHOLE,
        quantity: 8,
        unit: "đơn vị",
        expiryDate: "2024-12-20",
        status: "low",
        location: "Kho A-2",
        lastUpdated: "2024-12-10T09:15:00",
        isRare: true,
      },
      {
        id: 3,
        bloodType: "A+",
        component: COMPONENT_TYPES.PLASMA,
        quantity: 32,
        unit: "ml",
        expiryDate: "2025-01-15",
        status: "normal",
        location: "Kho B-1",
        lastUpdated: "2024-12-09T14:20:00",
        isRare: false,
      },
      {
        id: 4,
        bloodType: "AB-",
        component: COMPONENT_TYPES.PLATELETS,
        quantity: 3,
        unit: "đơn vị",
        expiryDate: "2024-12-15",
        status: "critical",
        location: "Kho C-1",
        lastUpdated: "2024-12-10T08:45:00",
        isRare: true,
      },
      {
        id: 5,
        bloodType: "B+",
        component: COMPONENT_TYPES.RED_CELLS,
        quantity: 28,
        unit: "đơn vị",
        expiryDate: "2024-12-30",
        status: "normal",
        location: "Kho A-3",
        lastUpdated: "2024-12-10T11:00:00",
        isRare: false,
      },
      {
        id: 6,
        bloodType: "B-",
        component: COMPONENT_TYPES.WHOLE,
        quantity: 5,
        unit: "đơn vị",
        expiryDate: "2024-12-18",
        status: "critical",
        location: "Kho A-4",
        lastUpdated: "2024-12-09T16:30:00",
        isRare: true,
      },
      {
        id: 7,
        bloodType: "AB+",
        component: COMPONENT_TYPES.PLASMA,
        quantity: 15,
        unit: "ml",
        expiryDate: "2025-01-20",
        status: "normal",
        location: "Kho B-2",
        lastUpdated: "2024-12-10T13:15:00",
        isRare: false,
      },
      {
        id: 8,
        bloodType: "A-",
        component: COMPONENT_TYPES.PLATELETS,
        quantity: 12,
        unit: "đơn vị",
        expiryDate: "2024-12-22",
        status: "normal",
        location: "Kho C-2",
        lastUpdated: "2024-12-10T07:30:00",
        isRare: false,
      },
    ];

    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = inventory;

    if (filters.bloodType !== "all") {
      filtered = filtered.filter(
        (item) => item.bloodType === filters.bloodType
      );
    }

    if (filters.component !== "all") {
      filtered = filtered.filter(
        (item) => item.component === filters.component
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    setFilteredInventory(filtered);
  }, [filters, inventory]);

  const getStatusText = (status) => {
    switch (status) {
      case "normal":
        return "Bình thường";
      case "low":
        return "Thấp";
      case "critical":
        return "Cực thấp";
      case "expired":
        return "Hết hạn";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "success";
      case "low":
        return "warning";
      case "critical":
        return "danger";
      case "expired":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return "expired";
    if (days <= 3) return "critical";
    if (days <= 7) return "warning";
    return "normal";
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const components = Object.values(COMPONENT_TYPES);

  const columns = [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center",
      render: (bloodType) => {
        const isPositive = bloodType.includes("+");
        return (
          <span
            className={`blood-type-badge ${
              isPositive ? "positive" : "negative"
            }`}
          >
            {bloodType}
          </span>
        );
      },
    },
    { title: "Thành phần", dataIndex: "component", key: "component" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (q, r) => `${q} ${r.unit}`,
    },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <span className={`status-badge ${s}`}>{getStatusText(s)}</span>
      ),
    },
    {
      title: "Hiếm",
      dataIndex: "isRare",
      key: "isRare",
      render: (v) => (v ? <span className="rare-badge">Hiếm</span> : null),
    },
  ];

  return (
    <DoctorLayout pageTitle="Kho máu">
      <div className="doctor-blood-inventory-content">
        {/* Thống kê hiện đại */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng kho máu"
                value={inventory.length}
                prefix="🩸"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Cực thấp"
                value={
                  inventory.filter((item) => item.status === "critical").length
                }
                prefix="⚠️"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Thấp"
                value={inventory.filter((item) => item.status === "low").length}
                prefix="📉"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Máu hiếm"
                value={inventory.filter((item) => item.isRare).length}
                prefix="⭐"
              />
            </Card>
          </Col>
        </Row>

        {/* Filter hiện đại */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <span style={{ marginRight: 8 }}>Nhóm máu:</span>
            <Select
              value={filters.bloodType}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, bloodType: value }))
              }
              style={{ width: 120 }}
              options={[
                { value: "all", label: "Tất cả" },
                ...bloodTypes.map((type) => ({ value: type, label: type })),
              ]}
            />
          </Col>
          <Col>
            <span style={{ marginRight: 8 }}>Thành phần:</span>
            <Select
              value={filters.component}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, component: value }))
              }
              style={{ width: 150 }}
              options={[
                { value: "all", label: "Tất cả" },
                ...components.map((type) => ({ value: type, label: type })),
              ]}
            />
          </Col>
          <Col>
            <span style={{ marginRight: 8 }}>Trạng thái:</span>
            <Select
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
              style={{ width: 150 }}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "normal", label: "Bình thường" },
                { value: "low", label: "Thấp" },
                { value: "critical", label: "Cực thấp" },
                { value: "expired", label: "Hết hạn" },
              ]}
            />
          </Col>
        </Row>

        {/* Table kho máu */}
        <Table
          dataSource={filteredInventory}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>
    </DoctorLayout>
  );
};

export default BloodInventoryViewPage;
