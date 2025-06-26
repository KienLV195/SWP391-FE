import { Row, Col, Select, Input } from "antd";
const { Option } = Select;
const { Search } = Input;

export default function ManagerBloodRequestsFilters({
  filters,
  setFilters,
  bloodTypes,
  statusOptions,
}) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8} md={6}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: "bold", color: "#20374E" }}>
            Tên bệnh nhân:
          </label>
        </div>
        <Search
          placeholder="Tìm theo tên hoặc mã yêu cầu..."
          value={filters.patientName}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              patientName: e.target.value,
            }))
          }
          style={{ width: "100%" }}
          allowClear
        />
      </Col>
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
    </Row>
  );
}
