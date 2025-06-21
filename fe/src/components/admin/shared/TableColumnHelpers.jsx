import React from "react";
import { Avatar, Badge, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ActionButtons from "./ActionButtons";

// Common column helpers
export const createIdColumn = (dataIndex = "id", width = 80) => ({
  title: "ID",
  dataIndex,
  key: "id",
  width,
  render: (id) => id,
});

export const createTitleColumn = (dataIndex = "title", render) => ({
  title: "Tiêu đề",
  dataIndex,
  key: "title",
  render: render || ((text) => <span style={{ fontWeight: 500 }}>{text}</span>),
});

export const createUserColumn = (dataIndex = "userId", userMap = {}) => ({
  title: "Người dùng",
  dataIndex,
  key: "user",
  render: (text, record) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Avatar icon={<UserOutlined />} style={{ background: "#1890ff" }} />
      <div>
        <div style={{ fontWeight: 500 }}>{userMap[text] || text}</div>
      </div>
    </div>
  ),
});

export const createDateColumn = (
  dataIndex = "createdAt",
  title = "Ngày tạo"
) => ({
  title,
  dataIndex,
  key: "date",
  render: (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  width: 120,
});

export const createStatusColumn = (
  dataIndex = "status",
  statusOptions = []
) => ({
  title: "Trạng thái",
  dataIndex,
  key: "status",
  render: (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    if (!statusObj) return status;

    let color = "blue";
    if (status === "active") color = "green";
    else if (status === "banned" || status === "inactive") color = "red";

    return <Badge color={color} text={statusObj.label} />;
  },
});

export const createImageColumn = (
  dataIndex = "imgUrl",
  title = "Thumbnail"
) => ({
  title,
  dataIndex,
  key: "image",
  render: (url) =>
    url ? (
      <img
        src={url}
        alt="thumbnail"
        style={{
          width: 60,
          height: 40,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
    ) : null,
});

export const createTagsColumn = (dataIndex = "tags") => ({
  title: "Tags",
  dataIndex,
  key: "tags",
  render: (tags) => {
    if (!tags || tags.length === 0) return "-";
    return tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>);
  },
});

export const createActionsColumn = (actions) => ({
  title: "Thao tác",
  key: "actions",
  align: "center",
  render: (_, record) => <ActionButtons {...actions} record={record} />,
});

// Common filter options
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "banned", label: "Cấm" },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "member", label: "Thành viên" },
  { value: "doctor", label: "Bác sĩ" },
  { value: "manager", label: "Quản lý" },
  { value: "admin", label: "Quản trị viên" },
];
