import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Table,
  Card,
  Row,
  Col,
  Select,
  Tag,
  Modal,
  Input,
  InputNumber,
  Checkbox,
  message,
  Statistic,
  Tooltip,
} from "antd";
import {
  DatabaseOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  StarOutlined,
} from "@ant-design/icons";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import PageHeader from "../../components/manager/PageHeader";
import {
  mockBloodInventory,
  getBloodInventoryWithStatus,
  BLOOD_GROUPS,
  RH_TYPES,
  COMPONENT_TYPES,
} from "../../services/mockData";
import "../../styles/pages/BloodInventoryManagement.scss";
import "../../styles/components/PageHeader.scss";

const { Option } = Select;

const BloodInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: "all",
    component: "all",
    status: "all",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newInventory, setNewInventory] = useState({
    bloodGroup: "",
    rhType: "",
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 0,
    isRare: false,
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    // TODO_API_REPLACE: Replace with actual API call - GET /api/manager/blood-inventory
    const inventoryWithStatus = getBloodInventoryWithStatus();
    setInventory(inventoryWithStatus);
    setFilteredInventory(inventoryWithStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "#D91022";
      case "low":
        return "#fa8c16";
      case "normal":
        return "#52c41a";
      case "high":
        return "#1890ff";
      default:
        return "#666666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "critical":
        return "Cực kỳ thiếu";
      case "low":
        return "Thiếu";
      case "normal":
        return "Bình thường";
      case "high":
        return "Dư thừa";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "critical":
        return <ExclamationCircleOutlined />;
      case "low":
        return <WarningOutlined />;
      case "normal":
        return <CheckCircleOutlined />;
      case "high":
        return <CheckCircleOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const getTableColumns = () => [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      width: 120,
      align: "center",
      render: (bloodType) => (
        <Tag
          color="#D93E4C"
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            padding: "4px 12px",
            borderRadius: "6px",
          }}
        >
          {bloodType}
        </Tag>
      ),
    },
    {
      title: "Thành phần",
      dataIndex: "componentType",
      key: "componentType",
      width: 150,
      render: (componentType) => (
        <span style={{ fontWeight: "500", color: "#20374E" }}>
          {componentType}
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      render: (quantity) => (
        <span
          style={{ fontWeight: "bold", color: "#20374E", fontSize: "16px" }}
        >
          {quantity}{" "}
          <span style={{ fontSize: "12px", color: "#666" }}>đơn vị</span>
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (status) => (
        <Tag
          icon={getStatusIcon(status)}
          color={getStatusColor(status)}
          style={{ fontWeight: "bold", padding: "4px 12px" }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Máu hiếm",
      dataIndex: "isRare",
      key: "isRare",
      width: 100,
      align: "center",
      render: (isRare) =>
        isRare ? (
          <Tag
            icon={<StarOutlined />}
            color="#D93E4C"
            style={{ fontWeight: "bold" }}
          >
            Hiếm
          </Tag>
        ) : (
          <span style={{ color: "#999" }}>Không</span>
        ),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 150,
      render: (lastUpdated) => (
        <span style={{ color: "#666", fontSize: "12px" }}>
          {new Date(lastUpdated).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditItem(record)}
              style={{ backgroundColor: "#20374E", borderColor: "#20374E" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteItem(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
        (item) => item.componentType === filters.component
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    setFilteredInventory(filtered);
  }, [filters, inventory]);

  const handleUpdateQuantity = (inventoryID, newQuantity) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.inventoryID === inventoryID) {
          const updatedItem = { ...item, quantity: newQuantity };

          // Recalculate status
          let status = "normal";
          if (newQuantity <= 2) {
            status = "critical";
          } else if (newQuantity <= 5) {
            status = "low";
          } else if (newQuantity >= 30) {
            status = "high";
          }

          updatedItem.status = status;
          updatedItem.statusIcon =
            status === "critical"
              ? "🚨"
              : status === "low"
              ? "⚠️"
              : status === "high"
              ? "✅"
              : "🔵";
          updatedItem.lastUpdated = new Date().toISOString();

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleAddInventory = () => {
    const newItem = {
      inventoryID: inventory.length + 1,
      bloodGroup: newInventory.bloodGroup,
      rhType: newInventory.rhType,
      bloodType: `${newInventory.bloodGroup}${newInventory.rhType}`,
      componentType: newInventory.componentType,
      quantity: newInventory.quantity,
      isRare: newInventory.isRare,
      lastUpdated: new Date().toISOString(),
    };

    // Calculate status
    let status = "normal";
    if (newItem.quantity <= 2) {
      status = "critical";
    } else if (newItem.quantity <= 5) {
      status = "low";
    } else if (newItem.quantity >= 30) {
      status = "high";
    }

    newItem.status = status;
    newItem.statusIcon =
      status === "critical"
        ? "🚨"
        : status === "low"
        ? "⚠️"
        : status === "high"
        ? "✅"
        : "🔵";

    // TODO_API_REPLACE: Replace with actual API call - POST /api/manager/blood-inventory
    setInventory((prev) => [...prev, newItem]);
    setShowAddModal(false);
    setNewInventory({
      bloodGroup: "",
      rhType: "",
      componentType: COMPONENT_TYPES.WHOLE,
      quantity: 0,
      isRare: false,
    });
    message.success("Đã thêm kho máu mới thành công!");
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  const handleDeleteItem = (item) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa kho máu ${item.bloodType} - ${item.componentType}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        // TODO_API_REPLACE: Replace with actual API call - DELETE /api/manager/blood-inventory/:id
        setInventory((prev) =>
          prev.filter((inv) => inv.inventoryID !== item.inventoryID)
        );
        message.success("Đã xóa kho máu thành công!");
      },
    });
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      handleUpdateQuantity(selectedItem.inventoryID, selectedItem.quantity);
      setShowUpdateModal(false);
      setSelectedItem(null);
      message.success("Đã cập nhật kho máu thành công!");
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Calculate statistics
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalItems = inventory.filter(
    (item) => item.status === "critical"
  ).length;
  const lowItems = inventory.filter((item) => item.status === "low").length;
  const rareBloodUnits = inventory
    .filter((item) => item.isRare)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="blood-inventory-management">
      <ManagerSidebar />

      <div className="blood-inventory-content">
        <PageHeader
          title="Quản lý Kho Máu"
          description="Theo dõi và quản lý tồn kho máu theo nhóm máu và thành phần"
          icon={DatabaseOutlined}
          actions={[
            {
              label: "Thêm kho máu",
              type: "primary",
              icon: <PlusOutlined />,
              onClick: () => setShowAddModal(true),
              style: { backgroundColor: "#D93E4C", borderColor: "#D93E4C" },
            },
            {
              label: "Làm mới",
              icon: <ReloadOutlined />,
              onClick: loadInventory,
            },
          ]}
        />

        {/* Quick Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng đơn vị"
                value={totalUnits}
                prefix={<DatabaseOutlined style={{ color: "#20374E" }} />}
                valueStyle={{ color: "#20374E", fontFamily: "$font-manager" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Cực kỳ thiếu"
                value={criticalItems}
                prefix={
                  <ExclamationCircleOutlined style={{ color: "#D91022" }} />
                }
                valueStyle={{ color: "#D91022", fontFamily: "$font-manager" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Thiếu"
                value={lowItems}
                prefix={<WarningOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ color: "#fa8c16", fontFamily: "$font-manager" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Máu hiếm"
                value={rareBloodUnits}
                prefix={<StarOutlined style={{ color: "#D93E4C" }} />}
                valueStyle={{ color: "#D93E4C", fontFamily: "$font-manager" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Nhóm máu:
                </label>
              </div>
              <Select
                value={filters.bloodType}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, bloodType: value }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn nhóm máu"
              >
                <Option value="all">Tất cả</Option>
                {bloodTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={8} md={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Thành phần:
                </label>
              </div>
              <Select
                value={filters.component}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, component: value }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn thành phần"
              >
                <Option value="all">Tất cả</Option>
                {Object.values(COMPONENT_TYPES).map((component) => (
                  <Option key={component} value={component}>
                    {component}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={8} md={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Trạng thái:
                </label>
              </div>
              <Select
                value={filters.status}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn trạng thái"
              >
                <Option value="all">Tất cả</Option>
                <Option value="critical">Cực kỳ thiếu</Option>
                <Option value="low">Thiếu</Option>
                <Option value="normal">Bình thường</Option>
                <Option value="high">Dư thừa</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Inventory Table */}
        <Card>
          <Table
            columns={getTableColumns()}
            dataSource={filteredInventory}
            rowKey="inventoryID"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>

      {/* Add Inventory Modal */}
      <Modal
        title="Thêm kho máu mới"
        open={showAddModal}
        onOk={handleAddInventory}
        onCancel={() => setShowAddModal(false)}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          disabled: !newInventory.bloodGroup || !newInventory.rhType,
          style: { backgroundColor: "#D93E4C", borderColor: "#D93E4C" },
        }}
        width={600}
      >
        <div style={{ padding: "16px 0" }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Nhóm máu:
                </label>
              </div>
              <Select
                value={newInventory.bloodGroup}
                onChange={(value) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    bloodGroup: value,
                  }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn nhóm máu"
              >
                {Object.values(BLOOD_GROUPS).map((group) => (
                  <Option key={group} value={group}>
                    {group}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Rh:
                </label>
              </div>
              <Select
                value={newInventory.rhType}
                onChange={(value) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    rhType: value,
                  }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn Rh"
              >
                {Object.values(RH_TYPES).map((rh) => (
                  <Option key={rh} value={rh}>
                    {rh}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Thành phần:
                </label>
              </div>
              <Select
                value={newInventory.componentType}
                onChange={(value) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    componentType: value,
                  }))
                }
                style={{ width: "100%" }}
                placeholder="Chọn thành phần"
              >
                {Object.values(COMPONENT_TYPES).map((component) => (
                  <Option key={component} value={component}>
                    {component}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: "bold", color: "#20374E" }}>
                  Số lượng:
                </label>
              </div>
              <InputNumber
                value={newInventory.quantity}
                onChange={(value) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    quantity: value || 0,
                  }))
                }
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng"
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Checkbox
                checked={newInventory.isRare}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    isRare: e.target.checked,
                  }))
                }
                style={{ fontWeight: "bold", color: "#20374E" }}
              >
                Máu hiếm
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Update Inventory Modal */}
      <Modal
        title={`Cập nhật kho máu ${selectedItem?.bloodType || ""}`}
        open={showUpdateModal}
        onOk={handleUpdateItem}
        onCancel={() => setShowUpdateModal(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: "#D93E4C", borderColor: "#D93E4C" },
        }}
        width={500}
      >
        {selectedItem && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: "bold", color: "#20374E" }}>
                    Nhóm máu:
                  </label>
                </div>
                <Input value={selectedItem.bloodType} disabled />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: "bold", color: "#20374E" }}>
                    Thành phần:
                  </label>
                </div>
                <Input value={selectedItem.componentType} disabled />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: "bold", color: "#20374E" }}>
                    Số lượng hiện tại:
                  </label>
                </div>
                <InputNumber
                  value={selectedItem.quantity}
                  onChange={(value) =>
                    setSelectedItem((prev) => ({
                      ...prev,
                      quantity: value || 0,
                    }))
                  }
                  min={0}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: "bold", color: "#20374E" }}>
                    Trạng thái hiện tại:
                  </label>
                </div>
                <Tag
                  icon={getStatusIcon(selectedItem.status)}
                  color={getStatusColor(selectedItem.status)}
                  style={{ fontWeight: "bold", padding: "4px 12px" }}
                >
                  {getStatusText(selectedItem.status)}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BloodInventoryManagement;
