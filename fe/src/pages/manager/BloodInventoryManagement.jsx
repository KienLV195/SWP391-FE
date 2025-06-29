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
  Tabs,
  Spin,
  DatePicker,
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
  MinusOutlined,
} from "@ant-design/icons";
import ManagerLayout from "../../components/manager/ManagerLayout";
import PageHeader from "../../components/manager/PageHeader";
import {
  fetchBloodInventory,
  checkInBloodInventory,
  checkOutBloodInventory,
} from "../../services/bloodInventoryService";
import authService from "../../services/authService";
import "../../styles/pages/BloodInventoryManagement.scss";
import "../../styles/components/PageHeader.scss";
import useBloodInventoryHistory from "../../hooks/useBloodInventoryHistory";
import ManagerBloodCheckInModal from "../../components/manager/blood-inventory/ManagerBloodCheckInModal";
import ManagerBloodCheckOutModal from "../../components/manager/blood-inventory/ManagerBloodCheckOutModal";
import ManagerBloodInventoryHistoryTable from "../../components/manager/blood-inventory/ManagerBloodInventoryHistoryTable";
import ManagerBloodInventoryHistoryFilters from "../../components/manager/blood-inventory/ManagerBloodInventoryHistoryFilters";
import ManagerBloodInventoryFilters from "../../components/manager/blood-inventory/ManagerBloodInventoryFilters";
import ManagerBloodInventoryStats from "../../components/manager/blood-inventory/ManagerBloodInventoryStats";
import ManagerBloodInventoryTable from "../../components/manager/blood-inventory/ManagerBloodInventoryTable";

const { Option } = Select;
const { RangePicker } = DatePicker;

const mapRhTypeToSymbol = (rhType) => {
  if (rhType === "Rh+") return "+";
  if (rhType === "Rh-") return "-";
  return rhType;
};

const BloodInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newInventory, setNewInventory] = useState({
    bloodGroup: "",
    rhType: "Rh+",
    componentType: "Whole",
    quantity: 0,
    isRare: false,
  });
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    bloodGroup: "",
    rhType: "",
    componentType: "",
    bagType: "",
    quantity: 0,
    notes: "",
  });
  const [checkOutForm, setCheckOutForm] = useState({
    bloodGroup: "",
    rhType: "",
    componentType: "",
    bagType: "",
    quantity: 0,
    notes: "",
  });
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");

  // Lịch sử hoạt động
  const {
    filters: historyFilters,
    setFilters: setHistoryFilters,
    filteredHistory,
    historyLoading,
    performers,
    fetchHistory,
  } = useBloodInventoryHistory();

  useEffect(() => {
    loadInventory();
  }, []);

  // Map lại trạng thái theo số lượng túi
  const loadInventory = async () => {
    try {
      const data = await fetchBloodInventory();
      const inventoryWithStatus = data.map((item) => {
        const bloodType = `${item.bloodGroup}${mapRhTypeToSymbol(item.rhType)}`;
        return {
          ...item,
          bloodType,
          inventoryId: item.InventoryID,
        };
      });
      setInventory(inventoryWithStatus);
    } catch (err) {
      setInventory([]);
    }
  };

  // Mapping status: 0: Khẩn cấp, 1: Thiếu máu, 2: Trung bình, 3: An toàn
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

  // Định nghĩa lại các hằng số đúng chuẩn API
  const COMPONENT_TYPES = {
    WHOLE: "Whole",
    RBC: "RBC",
    PLASMA: "Plasma",
    PLATELET: "Platelet",
  };
  const BLOOD_GROUPS = ["A", "B", "AB", "O"];
  const RH_TYPES = ["Rh+", "Rh-"];

  // Tạo các options filter động từ inventory
  const bloodTypes = Array.from(new Set(inventory.map((i) => i.bloodType)))
    .filter(Boolean)
    .map((type) => ({ text: type, value: type }));
  const componentTypes = Array.from(
    new Set(inventory.map((i) => i.componentType))
  )
    .filter(Boolean)
    .map((type) => ({ text: type, value: type }));
  const statusOptions = [
    { text: "Cảnh báo khẩn cấp", value: 0 },
    { text: "Thiếu máu", value: 1 },
    { text: "Trung bình", value: 2 },
    { text: "An toàn", value: 3 },
  ];

  // Calculate statistics
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalItems = inventory.filter(
    (item) => item.status === "critical"
  ).length;
  const lowItems = inventory.filter((item) => item.status === "low").length;
  const rareBloodUnits = inventory
    .filter((item) => item.isRare)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Xử lý nhập kho
  const handleCheckIn = async () => {
    setLoadingCheckIn(true);
    try {
      const userId = authService.getCurrentUser()?.id;
      const selected = inventory.find(
        (item) =>
          item.bloodGroup === checkInForm.bloodGroup &&
          item.rhType === checkInForm.rhType &&
          item.componentType === checkInForm.componentType &&
          item.bagType === checkInForm.bagType
      );
      if (!selected) throw new Error("Không tìm thấy kho máu phù hợp");
      const payload = {
        bloodGroup: checkInForm.bloodGroup,
        rhType: checkInForm.rhType,
        componentType: checkInForm.componentType,
        bagType: checkInForm.bagType,
        quantity: checkInForm.quantity,
        notes: checkInForm.notes || "",
        performedBy: userId,
      };
      await checkInBloodInventory(payload);
      setInventory((prev) =>
        prev.map((item) => {
          if (
            item.bloodGroup === checkInForm.bloodGroup &&
            item.rhType === checkInForm.rhType &&
            item.componentType === checkInForm.componentType &&
            item.bagType === checkInForm.bagType
          ) {
            return {
              ...item,
              quantity: item.quantity + checkInForm.quantity,
            };
          }
          return item;
        })
      );
      message.success("Nhập kho thành công!");
      setShowCheckInModal(false);
      setCheckInForm({
        bloodGroup: "",
        rhType: "",
        componentType: "",
        bagType: "",
        quantity: 0,
        notes: "",
      });
      fetchHistory();
      loadInventory();
    } catch {
      message.error("Nhập kho thất bại!");
    } finally {
      setLoadingCheckIn(false);
    }
  };

  // Xử lý xuất kho
  const handleCheckOut = async () => {
    setLoadingCheckOut(true);
    try {
      const userId = authService.getCurrentUser()?.id;
      const selected = inventory.find(
        (item) =>
          item.bloodGroup === checkOutForm.bloodGroup &&
          item.rhType === checkOutForm.rhType &&
          item.componentType === checkOutForm.componentType &&
          item.bagType === checkOutForm.bagType
      );
      if (!selected) throw new Error("Không tìm thấy kho máu phù hợp");
      const payload = {
        bloodGroup: checkOutForm.bloodGroup,
        rhType: checkOutForm.rhType,
        componentType: checkOutForm.componentType,
        bagType: checkOutForm.bagType,
        quantity: checkOutForm.quantity,
        notes: checkOutForm.notes || "",
        performedBy: userId,
      };
      await checkOutBloodInventory(payload);
      setInventory((prev) =>
        prev.map((item) => {
          if (
            item.bloodGroup === checkOutForm.bloodGroup &&
            item.rhType === checkOutForm.rhType &&
            item.componentType === checkOutForm.componentType &&
            item.bagType === checkOutForm.bagType
          ) {
            return {
              ...item,
              quantity: Math.max(0, item.quantity - checkOutForm.quantity),
            };
          }
          return item;
        })
      );
      message.success("Xuất kho thành công!");
      setShowCheckOutModal(false);
      setCheckOutForm({
        bloodGroup: "",
        rhType: "",
        componentType: "",
        bagType: "",
        quantity: 0,
        notes: "",
      });
      fetchHistory();
      loadInventory();
    } catch {
      message.error("Xuất kho thất bại!");
    } finally {
      setLoadingCheckOut(false);
    }
  };

  const getTableColumns = () => [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      width: 120,
      align: "center",
      filters: bloodTypes,
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
      title: "Thành phần",
      dataIndex: "componentType",
      key: "componentType",
      width: 150,
      filters: componentTypes,
      onFilter: (value, record) => record.componentType === value,
      render: (componentType) => (
        <span style={{ fontWeight: "500", color: "#20374E" }}>
          {componentType}
        </span>
      ),
    },
    {
      title: "Loại túi",
      dataIndex: "bagType",
      key: "bagType",
      width: 100,
      filters: Array.from(new Set(inventory.map((i) => i.bagType)))
        .filter(Boolean)
        .map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.bagType === value,
      render: (bagType) => bagType || "-",
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
          <span style={{ fontSize: "12px", color: "#666" }}>túi</span>
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      filters: statusOptions,
      onFilter: (value, record) => record.status === value,
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
      title: "Máu hiếm",
      dataIndex: "isRare",
      key: "isRare",
      width: 100,
      align: "center",
      filters: [
        { text: "Hiếm", value: true },
        { text: "Không hiếm", value: false },
      ],
      onFilter: (value, record) => String(record.isRare) === String(value),
      render: (isRare) =>
        isRare ? (
          <span className="rare-badge">
            <StarOutlined style={{ marginRight: "4px" }} />
            Hiếm
          </span>
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
  ];

  const handleUpdateQuantity = (inventoryID, newQuantity) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.inventoryId === inventoryID) {
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
      inventoryId: inventory.length + 1,
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

    setInventory((prev) => [...prev, newItem]);
    setShowAddModal(false);
    setNewInventory({
      bloodGroup: "",
      rhType: "",
      componentType: "Whole",
      quantity: 0,
      isRare: false,
    });
    message.success("Đã thêm kho máu mới thành công!");
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      handleUpdateQuantity(selectedItem.inventoryId, selectedItem.quantity);
      setShowUpdateModal(false);
      setSelectedItem(null);
      message.success("Đã cập nhật kho máu thành công!");
    }
  };

  return (
    <ManagerLayout pageTitle="Quản lý kho máu">
      <div className="blood-inventory-management-page">
        <PageHeader title="Quản lý kho máu" icon={DatabaseOutlined} />

        {/* Tabs + 2 nút nhập/xuất kho */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            gap: 12,
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "inventory", label: "Kho máu" },
              { key: "history", label: "Lịch sử hoạt động" },
            ]}
            style={{ flex: 1 }}
          />
          {activeTab === "inventory" && (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => setShowCheckInModal(true)}
              >
                Nhập kho
              </Button>
              <Button
                type="primary"
                icon={<MinusOutlined />}
                style={{ backgroundColor: "#D91022", borderColor: "#D91022" }}
                onClick={() => setShowCheckOutModal(true)}
              >
                Xuất kho
              </Button>
            </>
          )}
        </div>

        {/* Tab content */}
        {activeTab === "inventory" && (
          <>
            <ManagerBloodInventoryStats
              totalUnits={totalUnits}
              criticalItems={criticalItems}
              lowItems={lowItems}
              rareBloodUnits={rareBloodUnits}
            />
            <Card>
              <ManagerBloodInventoryTable
                columns={getTableColumns()}
                data={inventory}
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
          </>
        )}
        {activeTab === "history" && (
          <Card>
            <ManagerBloodInventoryHistoryFilters
              filters={historyFilters}
              setFilters={setHistoryFilters}
              inventory={inventory}
              performers={performers}
            />
            <ManagerBloodInventoryHistoryTable
              data={filteredHistory}
              loading={historyLoading}
            />
          </Card>
        )}
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
                {BLOOD_GROUPS.map((group) => (
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
                {RH_TYPES.map((rh) => (
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

      {/* Modal Nhập kho */}
      <ManagerBloodCheckInModal
        open={showCheckInModal}
        onOk={handleCheckIn}
        onCancel={() => setShowCheckInModal(false)}
        confirmLoading={loadingCheckIn}
        inventory={inventory}
        form={checkInForm}
        setForm={setCheckInForm}
      />

      {/* Modal Xuất kho */}
      <ManagerBloodCheckOutModal
        open={showCheckOutModal}
        onOk={handleCheckOut}
        onCancel={() => setShowCheckOutModal(false)}
        confirmLoading={loadingCheckOut}
        inventory={inventory}
        form={checkOutForm}
        setForm={setCheckOutForm}
      />
    </ManagerLayout>
  );
};

export default BloodInventoryManagement;
