import React from "react";
import { Modal, Button, Row, Col, Popconfirm, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const BlogDetailModal = ({
  visible,
  selectedBlog,
  activeTab,
  userMap,
  onClose,
  onDelete,
}) => {
  if (!selectedBlog) return null;

  return (
    <Modal
      title={selectedBlog.title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div style={{ padding: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          {selectedBlog.title}
        </div>
        <div style={{ marginBottom: 8, color: "#888" }}>
          <b>ID:</b>{" "}
          {activeTab === "Tài liệu"
            ? selectedBlog.articleId
            : selectedBlog.postId}{" "}
          &nbsp;|&nbsp;
          <b>Người viết:</b>{" "}
          {selectedBlog.userId && userMap[selectedBlog.userId]
            ? userMap[selectedBlog.userId]
            : selectedBlog.userId}
          {activeTab === "Tin tức" && selectedBlog.postedAt && (
            <>
              &nbsp;|&nbsp;
              <b>Ngày đăng:</b>{" "}
              {new Date(selectedBlog.postedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          )}
        </div>
        {selectedBlog.imgUrl && (
          <div style={{ marginBottom: 12 }}>
            <img
              src={selectedBlog.imgUrl}
              alt="thumbnail"
              style={{
                maxWidth: 200,
                borderRadius: 8,
                boxShadow: "0 2px 8px #eee",
              }}
            />
          </div>
        )}
        {activeTab === "Tài liệu" && (
          <div style={{ marginBottom: 8 }}>
            <b>Tags:</b>{" "}
            {selectedBlog.tags && selectedBlog.tags.length > 0
              ? selectedBlog.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)
              : "-"}
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          <b>Mô tả ngắn:</b> {selectedBlog.title || "-"}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Nội dung:</b>
          <div
            style={{
              background: "#fafafa",
              padding: 12,
              borderRadius: 6,
              marginTop: 4,
              minHeight: 60,
            }}
          >
            {selectedBlog.content ? (
              <div style={{ whiteSpace: "pre-line" }}>
                {selectedBlog.content}
              </div>
            ) : (
              <span style={{ color: "#aaa" }}>Không có nội dung</span>
            )}
          </div>
        </div>
        <Row justify="end" style={{ marginTop: 16 }} gutter={8}>
          <Col>
            <Button onClick={onClose}>Đóng</Button>
          </Col>
          <Col>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() =>
                onDelete(
                  activeTab === "Tài liệu"
                    ? selectedBlog.articleId
                    : selectedBlog.postId
                )
              }
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa bài viết
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default BlogDetailModal;
