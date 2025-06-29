import { Row, Col, Select } from "antd";
const { Option } = Select;

export default function ManagerBloodInventoryFilters({
  filters,
  setFilters,
  bloodTypes,
  componentTypes,
  statusOptions,
}) {
  return (
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
          {componentTypes.map((component) => (
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
          {statusOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={8} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: "bold", color: "#20374E" }}>
            Máu hiếm:
          </label>
        </div>
        <Select
          value={filters.isRare || "all"}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, isRare: value }))
          }
          style={{ width: "100%" }}
          placeholder="Chọn máu hiếm"
        >
          <Option value="all">Tất cả</Option>
          <Option value="true">Hiếm</Option>
          <Option value="false">Không hiếm</Option>
        </Select>
      </Col>
    </Row>
  );
}
