import React from "react";
import { Modal, Button, Row, Col, Popconfirm, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ArticleTags from "../../common/ArticleTags";

const BlogDetailModal = ({
  visible,
  selectedBlog,
  activeTab,
  userMap,
  onClose,
  onDelete,
}) => {
  if (!selectedBlog) return null;

  // Nếu là activity log, hiển thị thông tin khác
  if (activeTab === "Theo dõi hoạt động") {
    return (
      <Modal
        title="Chi tiết hoạt động"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <div style={{ padding: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            {selectedBlog.description}
          </div>
          <div style={{ marginBottom: 8, color: "#888" }}>
            <b>Log ID:</b> {selectedBlog.logId} &nbsp;|&nbsp;
            <b>Người thực hiện:</b> {selectedBlog.userName} &nbsp;|&nbsp;
            <b>Vai trò:</b> {selectedBlog.roleName}
          </div>
          <div style={{ marginBottom: 8, color: "#888" }}>
            <b>Loại hoạt động:</b> {selectedBlog.activityType} &nbsp;|&nbsp;
            <b>Loại đối tượng:</b> {selectedBlog.entityType} &nbsp;|&nbsp;
            <b>ID đối tượng:</b> {selectedBlog.entityId}
          </div>
          <div style={{ marginBottom: 8, color: "#888" }}>
            <b>Thời gian:</b>{" "}
            {new Date(selectedBlog.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Mô tả chi tiết:</b>
            <div
              style={{
                background: "#fafafa",
                padding: 12,
                borderRadius: 6,
                marginTop: 4,
                minHeight: 60,
              }}
            >
              {selectedBlog.description ? (
                <div style={{ whiteSpace: "pre-line" }}>
                  {selectedBlog.description}
                </div>
              ) : (
                <span style={{ color: "#aaa" }}>Không có mô tả</span>
              )}
            </div>
          </div>
          <Row justify="end" style={{ marginTop: 16 }} gutter={8}>
            <Col>
              <Button onClick={onClose}>Đóng</Button>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

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
          {selectedBlog.userId && userMap && userMap[selectedBlog.userId]
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
        {(activeTab === "Tài liệu" || activeTab === "Tin tức") && (
          <div style={{ marginBottom: 8 }}>
            <b>Tags:</b>{" "}
            {selectedBlog.tags && selectedBlog.tags.length > 0 ? (
              <ArticleTags tags={selectedBlog.tags} />
            ) : (
              "-"
            )}
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
