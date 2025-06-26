import React from "react";
import { Table, Button, Badge, Avatar, Row, Col, Tooltip, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động", apiValue: 1 },
  { value: "inactive", label: "Không hoạt động", apiValue: 0 },
  { value: "banned", label: "Cấm", apiValue: 2 },
];

const UserTableColumns = ({ onEdit, onDelete }) => {
  const actionButtonStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    background: "#f6ffed",
    color: "#52c41a",
    border: "1px solid #b7eb8f",
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    background: "#fff2f0",
    color: "#ff4d4f",
    border: "1px solid #ffccc7",
  };

  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => (
        <span
          style={{
            fontFamily: "monospace",
            background: "#f0f2f5",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "500",
            color: "#1890ff",
          }}
        >
          #{id}
        </span>
      ),
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
      width: 180,
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#52c41a", fontSize: "14px" }} />
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {date ? new Date(date).toLocaleString("vi-VN") : "Chưa có"}
          </span>
        </Space>
      ),
      sorter: (a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
      },
      defaultSortOrder: "descend",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Row gutter={8} justify="center">
          <Col>
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
              style={editButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
          </Col>
          <Col>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => onDelete(record)}
              style={deleteButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];
};

export default UserTableColumns;
