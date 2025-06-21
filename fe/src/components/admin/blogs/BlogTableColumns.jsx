import React from "react";
import { Button, Row, Col, Popconfirm, Badge } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const BlogTableColumns = ({ activeTab, userMap, onView, onEdit, onDelete }) => [
  {
    title: "ID",
    dataIndex: activeTab === "Tài liệu" ? "articleId" : "postId",
    key: "id",
    width: 80,
  },
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: "Người viết",
    dataIndex: "userId",
    key: "userId",
    render: (userId) => userMap[userId] || userId,
  },
  {
    title: "Ngày đăng",
    dataIndex: "postedAt",
    key: "postedAt",
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
  },
  {
    title: "Thumbnail",
    dataIndex: "imgUrl",
    key: "imgUrl",
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
  },
  {
    title: "Thao tác",
    key: "actions",
    align: "center",
    render: (_, record) => (
      <Row gutter={8} justify="center">
        <Col>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            size="small"
          />
        </Col>
        <Col>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          />
        </Col>
        <Col>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => onDelete(record.articleId || record.postId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];

export default BlogTableColumns;
