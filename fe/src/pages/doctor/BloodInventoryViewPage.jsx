import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import { fetchBloodInventory } from "../../services/bloodInventoryService";
import "../../styles/pages/BloodInventoryViewPage.scss";
import { Card, Table } from "antd";
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return "#D91022"; // đỏ
    case 1:
      return "#fa8c16"; // cam
    case 2:
      return "#FFD600"; // vàng
    case 3:
      return "#52c41a"; // xanh lá
    default:
      return "#666666";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Cảnh báo khẩn cấp";
    case 1:
      return "Thiếu máu";
    case 2:
      return "Trung bình";
    case 3:
      return "An toàn";
    default:
      return "Không xác định";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 0:
      return <ExclamationCircleOutlined />;
    case 1:
      return <WarningOutlined />;
    case 2:
      return <WarningOutlined style={{ color: "#FFD600" }} />;
    case 3:
      return <CheckCircleOutlined />;
    default:
      return <ExclamationCircleOutlined />;
  }
};

const BloodInventoryViewPage = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchBloodInventory().then((data) => {
      const mapped = data.map((item, idx) => ({
        key: idx,
        bloodType: `${item.bloodGroup}${item.rhType === "Rh+" ? "+" : "-"}`,
        componentType: item.componentType,
        bagType: item.bagType || "250ml",
        quantity: item.quantity,
        status: item.status,
        isRare: item.isRare,
        lastUpdated: item.lastUpdated,
      }));
      setInventory(mapped);
    });
  }, []);

  // Build filters for each column
  const bloodTypeFilters = Array.from(
    new Set(inventory.map((i) => i.bloodType))
  )
    .filter(Boolean)
    .map((type) => ({ text: type, value: type }));
  const componentTypeFilters = Array.from(
    new Set(inventory.map((i) => i.componentType))
  )
    .filter(Boolean)
    .map((type) => ({ text: type, value: type }));
  const bagTypeFilters = Array.from(new Set(inventory.map((i) => i.bagType)))
    .filter(Boolean)
    .map((type) => ({ text: type, value: type }));
  const statusFilters = [
    { text: "Cảnh báo khẩn cấp", value: 0 },
    { text: "Thiếu máu", value: 1 },
    { text: "Trung bình", value: 2 },
    { text: "An toàn", value: 3 },
  ];
  const rareFilters = [
    { text: "Hiếm", value: true },
    { text: "Không hiếm", value: false },
  ];

  const columns = [
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Nhóm máu</div>,
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center",
      filters: bloodTypeFilters,
      onFilter: (value, record) => record.bloodType === value,
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
    {
      title: (
        <div style={{ textAlign: "center", width: "100%" }}>Thành phần</div>
      ),
      dataIndex: "componentType",
      key: "componentType",
      align: "center",
      filters: componentTypeFilters,
      onFilter: (value, record) => record.componentType === value,
    },
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Loại túi</div>,
      dataIndex: "bagType",
      key: "bagType",
      width: 100,
      align: "center",
      filters: bagTypeFilters,
      onFilter: (value, record) => record.bagType === value,
      render: (bagType) => bagType || "-",
    },
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Số lượng</div>,
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      render: (quantity) => (
        <span
          style={{ fontWeight: "bold", color: "#20374E", fontSize: "16px" }}
        >
          {quantity}{" "}
          <span style={{ fontSize: "12px", color: "#666" }}>túi</span>
        </span>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", width: "100%" }}>Trạng thái</div>
      ),
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      filters: statusFilters,
      onFilter: (value, record) => String(record.status) === String(value),
      render: (status) => (
        <span
          className="status-badge"
          style={{
            backgroundColor: getStatusColor(status) + "20",
            color: getStatusColor(status),
            borderColor: getStatusColor(status) + "40",
          }}
        >
          {getStatusIcon(status)}
          <span style={{ marginLeft: "4px" }}>{getStatusText(status)}</span>
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Hiếm</div>,
      dataIndex: "isRare",
      key: "isRare",
      width: 100,
      align: "center",
      filters: rareFilters,
      onFilter: (value, record) => String(record.isRare) === String(value),
      render: (v) =>
        v ? (
          <span className="rare-badge">Hiếm</span>
        ) : (
          <span style={{ color: "#999" }}>Không</span>
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center", width: "100%" }}>Cập nhật cuối</div>
      ),
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      align: "center",
      render: (val) => (val ? new Date(val).toLocaleString("vi-VN") : ""),
    },
  ];

  return (
    <DoctorLayout pageTitle="Kho máu">
      <div className="blood-inventory-view">
        <div className="blood-inventory-view-content no-margin-padding">
          <Card bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={inventory}
              columns={columns}
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default BloodInventoryViewPage;
