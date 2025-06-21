import React from "react";
import { Input, Select, Col, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const UserFilterBar = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onAddUser,
  roleOptions = [],
}) => (
  <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
    <Input
      placeholder="Tìm kiếm theo tên hoặc email"
      value={searchTerm}
      onChange={onSearchChange}
      style={{ width: 240 }}
      prefix={<SearchOutlined />}
    />
    <Select
      value={roleFilter}
      onChange={onRoleChange}
      style={{ width: 220 }}
      allowClear={false}
    >
      {roleOptions.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
    <Select
      value={statusFilter}
      onChange={onStatusChange}
      style={{ width: 180 }}
      allowClear={false}
    >
      <Option value="all">Tất cả trạng thái</Option>
      <Option value="active">Hoạt động</Option>
      <Option value="inactive">Không hoạt động</Option>
      <Option value="banned">Cấm</Option>
    </Select>
    <Col flex="auto" style={{ textAlign: "right" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddUser}
        style={{ minWidth: 140 }}
      >
        Thêm người dùng
      </Button>
    </Col>
  </div>
);

export default UserFilterBar;
