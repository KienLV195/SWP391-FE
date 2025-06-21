import React from "react";
import { Table, Button, Badge, Avatar, Row, Col, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động", apiValue: 1 },
  { value: "inactive", label: "Không hoạt động", apiValue: 0 },
  { value: "banned", label: "Cấm", apiValue: 2 },
];

const UserTableColumns = ({ onEdit, onDelete }) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    render: (id) => id,
  },
  {
    title: "Người dùng",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar icon={<UserOutlined />} style={{ background: "#1890ff" }} />
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.email}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.phone}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    render: (_, record) => <Badge color="blue" text={record.roleLabel} />,
    filters: [
      { text: "Thành viên", value: "member" },
      { text: "Bác sĩ - Khoa Huyết học", value: "doctor_blood" },
      { text: "Bác sĩ - Khoa khác", value: "doctor_other" },
      { text: "Quản lý", value: "manager" },
      { text: "Quản trị viên", value: "admin" },
    ],
    onFilter: (value, record) => record.role.startsWith(value),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusObj =
        STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[1];
      let color =
        status === "active" ? "green" : status === "banned" ? "red" : "gray";
      return (
        <Tooltip
          title={status === "banned" ? "Tài khoản bị cấm đăng nhập" : ""}
        >
          <Badge color={color} text={statusObj.label} />
        </Tooltip>
      );
    },
    filters: [
      { text: "Tất cả", value: "all" },
      ...STATUS_OPTIONS.map((s) => ({ text: s.label, value: s.value })),
    ],
    onFilter: (value, record) => value === "all" || record.status === value,
  },
  {
    title: "Ngày tạo tài khoản",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : ""),
  },
  {
    title: "Thao tác",
    key: "actions",
    render: (_, record) => (
      <Row gutter={8}>
        <Col>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          />
        </Col>
        <Col>
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => onDelete(record)}
          />
        </Col>
      </Row>
    ),
  },
];

export default UserTableColumns;
