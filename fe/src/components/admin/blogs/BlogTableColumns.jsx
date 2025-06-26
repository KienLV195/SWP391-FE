import React from "react";
import { Button, Row, Col, Popconfirm, Badge, Tag, Space } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { ActivityLogTableColumns } from "./ActivityLogTableColumns";

const BlogTableColumns = ({ activeTab, userMap, onView, onEdit, onDelete }) => {
  // If it's the activity log tab, use the ActivityLogTableColumns
  if (activeTab === "Theo dõi hoạt động") {
    return ActivityLogTableColumns({ userMap });
  }

  const actionButtonStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const viewButtonStyle = {
    ...actionButtonStyle,
    background: "#e6f7ff",
    color: "#1890ff",
    border: "1px solid #91d5ff",
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
      dataIndex: activeTab === "Tài liệu" ? "articleId" : "postId",
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
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: false,
      render: (text) => (
        <div
          style={{
            fontWeight: "600",
            fontSize: "14px",
            color: "#262626",
            lineHeight: "1.4",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            maxWidth: 200,
            minWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Người viết",
      dataIndex: "userId",
      key: "userId",
      width: 120,
      render: (userId) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
          <span style={{ fontWeight: "500", fontSize: "13px" }}>
            {userMap[userId] || userId || "Unknown"}
          </span>
        </Space>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: activeTab === "Tài liệu" ? "createdAt" : "postedAt",
      key: "createdAt",
      width: 140,
      render: (date) => {
        if (!date)
          return (
            <span
              style={{ color: "#999", fontStyle: "italic", fontSize: "12px" }}
            >
              Chưa có
            </span>
          );
        return (
          <Space>
            <CalendarOutlined style={{ color: "#52c41a", fontSize: "14px" }} />
            <span
              style={{
                fontSize: "12px",
                color: "#666",
                fontWeight: "500",
              }}
            >
              {new Date(date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </Space>
        );
      },
    },
    {
      title: "Thumbnail",
      dataIndex: "imgUrl",
      key: "imgUrl",
      width: 100,
      render: (url) =>
        url ? (
          <div
            style={{
              width: 60,
              height: 40,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={url}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 60,
              height: 40,
              borderRadius: "8px",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "12px",
              border: "1px dashed #d9d9d9",
            }}
          >
            {activeTab === "Tài liệu" ? (
              <FileTextOutlined style={{ fontSize: "16px" }} />
            ) : (
              <NotificationOutlined style={{ fontSize: "16px" }} />
            )}
          </div>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Row gutter={8} justify="center">
          <Col>
            <Button
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
              style={viewButtonStyle}
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
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => onDelete(record.articleId || record.postId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
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
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];
};

export default BlogTableColumns;
