import React from "react";
import { Tag, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export const ActivityLogTableColumns = ({ userMap }) => {
  const getActivityTypeIcon = (type) => {
    switch (type) {
      case "Create":
        return <PlusOutlined style={{ color: "#52c41a", fontSize: "12px" }} />;
      case "Update":
        return <EditOutlined style={{ color: "#1890ff", fontSize: "12px" }} />;
      case "Delete":
        return (
          <DeleteOutlined style={{ color: "#ff4d4f", fontSize: "12px" }} />
        );
      default:
        return <FileTextOutlined style={{ fontSize: "12px" }} />;
    }
  };

  const tagStyle = {
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "500",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
  };

  const activityTagStyle = {
    ...tagStyle,
    background: "#e6f7ff",
    color: "#1890ff",
    border: "1px solid #91d5ff",
  };

  const entityTagStyle = {
    ...tagStyle,
    background: "#f6ffed",
    color: "#52c41a",
    border: "1px solid #b7eb8f",
  };

  const roleTagStyle = {
    ...tagStyle,
    background: "#fff7e6",
    color: "#fa8c16",
    border: "1px solid #ffd591",
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userID",
      key: "userID",
      width: 120,
      render: (userID) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
          <span style={{ fontWeight: "500" }}>
            {userMap[userID] || `User ${userID}`}
          </span>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      width: 100,
      render: (roleName) => {
        return roleName ? (
          <Tag
            style={roleTagStyle}
            icon={<TeamOutlined style={{ fontSize: "11px" }} />}
          >
            {roleName}
          </Tag>
        ) : (
          <span
            style={{
              color: "#999",
              fontStyle: "italic",
              fontSize: "12px",
              padding: "4px 8px",
              background: "#f5f5f5",
              borderRadius: "12px",
            }}
          >
            Chưa có
          </span>
        );
      },
    },
    {
      title: "Loại hoạt động",
      dataIndex: "activityType",
      key: "activityType",
      width: 120,
      render: (activityType) => (
        <Tag style={activityTagStyle} icon={getActivityTypeIcon(activityType)}>
          {activityType}
        </Tag>
      ),
    },
    {
      title: "Loại đối tượng",
      dataIndex: "entityType",
      key: "entityType",
      width: 120,
      render: (entityType) => <Tag style={entityTagStyle}>{entityType}</Tag>,
    },
    {
      title: "ID đối tượng",
      dataIndex: "entityId",
      key: "entityId",
      width: 100,
      render: (entityId) => (
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
          #{entityId}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: false,
      render: (description) => (
        <div
          style={{
            maxWidth: 300,
            minWidth: 200,
            lineHeight: "1.5",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            padding: "4px 0",
          }}
        >
          {description || "Không có mô tả"}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt) => (
        <Space>
          <CalendarOutlined style={{ color: "#52c41a", fontSize: "14px" }} />
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
          </span>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend",
    },
  ];

  return columns;
};
