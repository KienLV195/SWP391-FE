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
import { getNewsId, getNewsUserId } from "../../../utils/newsUtils";

const BlogTableColumns = ({
  activeTab,
  userMap,
  onView,
  onEdit,
  onDelete,
  currentUser,
}) => {
  // If it's the activity log tab, use the ActivityLogTableColumns
  if (activeTab === "Theo dõi hoạt động") {
    return ActivityLogTableColumns();
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

  const columns = [
    {
      title: "ID",
      dataIndex: activeTab === "Tài liệu" ? "articleId" : "postId",
      key: "id",
      width: 80,
      render: (id, record) => {
        // Xử lý ID cho tin tức - thử nhiều trường hợp khác nhau
        let displayId = id;
        if (activeTab === "Tin tức") {
          displayId = getNewsId(record) || id;
        }
        return (
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
            #{displayId}
          </span>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 180,
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
            maxWidth: 180,
            minWidth: 120,
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
      width: 100,
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
      width: 120,
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
      width: 80,
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
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 150,
      render: (tags) => {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return (
            <span
              style={{ color: "#999", fontStyle: "italic", fontSize: "12px" }}
            >
              Không có tags
            </span>
          );
        }

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {tags.map((tag, index) => {
              // Xử lý cả format cũ (string) và format mới (object với tagId, tagName)
              const tagName =
                typeof tag === "object" && tag.tagName ? tag.tagName : tag;
              const tagId =
                typeof tag === "object" && tag.tagId ? tag.tagId : index;

              return (
                <Tag
                  key={tagId}
                  color="blue"
                  style={{
                    fontSize: "11px",
                    padding: "2px 6px",
                    margin: 0,
                    borderRadius: "12px",
                    border: "none",
                    background: "#e6f7ff",
                    color: "#1890ff",
                  }}
                >
                  {tagName}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => {
        // Kiểm tra xem user hiện tại có quyền chỉnh sửa bài viết này không
        const recordUserId =
          activeTab === "Tin tức"
            ? getNewsUserId(record)
            : record.userId ||
              record.userID ||
              record.authorId ||
              record.createdBy;
        const currentUserId =
          currentUser?.id || currentUser?.userId || currentUser?.userID;

        const canEdit =
          !currentUser ||
          currentUser.role === "4" || // Admin role
          currentUser.role === "admin" || // Fallback for string role
          currentUser.role === "Admin" || // Fallback for string role
          String(recordUserId) === String(currentUserId);

        return (
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
            {canEdit && (
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
            )}
            {canEdit && (
              <Col>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa bài viết này?"
                  onConfirm={() => {
                    // Xử lý ID cho tin tức - thử nhiều trường hợp khác nhau
                    let deleteId;
                    if (activeTab === "Tài liệu") {
                      deleteId = record.articleId;
                    } else {
                      // Cho tin tức, sử dụng utility
                      deleteId = getNewsId(record);
                    }
                    onDelete(deleteId);
                  }}
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
            )}
          </Row>
        );
      },
    },
  ];

  return columns;
};

export default BlogTableColumns;
