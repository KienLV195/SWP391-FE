import React from "react";
import { Space, Tag, Button, Tooltip } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const BlogTableColumns = ({ activeTab, userMap, onView, onEdit, onDelete }) => {
  const getArticleColumns = () => [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.content?.substring(0, 100)}...
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "userId",
      key: "author",
      width: "15%",
      render: (userId) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <UserOutlined style={{ color: "#1890ff" }} />
          <span>{userMap[userId] || `User ${userId}`}</span>
        </div>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "20%",
      render: (tags) => (
        <Space size="small">
          {Array.isArray(tags) &&
            tags.map((tag, index) => {
              const tagText =
                typeof tag === "object" && tag.tagName ? tag.tagName : tag;
              const tagKey =
                typeof tag === "object" && tag.tagId ? tag.tagId : tag || index;

              return (
                <Tag key={tagKey} color="blue">
                  {tagText}
                </Tag>
              );
            })}
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarOutlined style={{ color: "#52c41a" }} />
          <span>{dayjs(date).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.articleId)}
              size="small"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getNewsColumns = () => [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.content?.substring(0, 100)}...
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "userId",
      key: "author",
      width: "15%",
      render: (userId) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <UserOutlined style={{ color: "#1890ff" }} />
          <span>{userMap[userId] || `User ${userId}`}</span>
        </div>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "20%",
      render: (tags) => (
        <Space size="small">
          {Array.isArray(tags) &&
            tags.map((tag, index) => {
              const tagText =
                typeof tag === "object" && tag.tagName ? tag.tagName : tag;
              const tagKey =
                typeof tag === "object" && tag.tagId ? tag.tagId : tag || index;

              return (
                <Tag key={tagKey} color="blue">
                  {tagText}
                </Tag>
              );
            })}
        </Space>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedAt",
      key: "postedAt",
      width: "15%",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarOutlined style={{ color: "#52c41a" }} />
          <span>{dayjs(date).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.postId)}
              size="small"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getActivityLogColumns = () => [
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "30%",
      render: (text) => <div style={{ fontWeight: "500" }}>{text}</div>,
    },
    {
      title: "Loại hoạt động",
      dataIndex: "activityType",
      key: "activityType",
      width: "15%",
      render: (type) => (
        <Tag
          color={
            type === "CREATE" ? "green" : type === "UPDATE" ? "blue" : "red"
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "userID",
      key: "user",
      width: "15%",
      render: (userId) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <UserOutlined style={{ color: "#1890ff" }} />
          <span>{userMap[userId] || `User ${userId}`}</span>
        </div>
      ),
    },
    {
      title: "Ngày thực hiện",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarOutlined style={{ color: "#52c41a" }} />
          <span>{dayjs(date).format("DD/MM/YYYY HH:mm")}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  switch (activeTab) {
    case "Tài liệu":
      return getArticleColumns();
    case "Tin tức":
      return getNewsColumns();
    case "Theo dõi hoạt động":
      return getActivityLogColumns();
    default:
      return getArticleColumns();
  }
};

export default BlogTableColumns;
