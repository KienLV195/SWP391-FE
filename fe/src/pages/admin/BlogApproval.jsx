import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  Badge,
  Popconfirm,
  Spin,
  Row,
  Col,
  message,
  Form,
  Select,
  Tag,
  Upload,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  NotificationOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchBloodArticles,
  deleteBloodArticle,
  putBlog,
} from "../../services/bloodArticleService";

const { TabPane } = Tabs;
const { Option } = Select;

const CATEGORY_OPTIONS = [
  { value: "Tài liệu", label: "Tài liệu", icon: <FileTextOutlined /> },
  { value: "Tin tức", label: "Tin tức", icon: <NotificationOutlined /> },
];

const BlogApproval = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Tài liệu");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [editImage, setEditImage] = useState(null);
  const [setEditTags] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchBloodArticles()
      .then((data) => {
        // Xử lý lỗi font: decode các ký tự lỗi về Unicode chuẩn (nếu có)
        const decodeString = (str) => {
          if (!str || typeof str !== "string") return str;
          try {
            return decodeURIComponent(escape(str));
          } catch {
            return str;
          }
        };
        setBlogs(
          (Array.isArray(data) ? data : []).map((item) => ({
            articleId: item.articleId || item.bloodArticleID || item.id,
            title: decodeString(item.title),
            userName: decodeString(
              item.userName || item.authorName || item.author || ""
            ),
            tags: item.tags
              ? Array.isArray(item.tags)
                ? item.tags.map(decodeString)
                : item.tags.split(",").map(decodeString)
              : [],
            imgUrl: item.imgUrl || item.featuredImage || item.image || "",
            category: item.category || "Tài liệu",
            excerpt: decodeString(item.excerpt || ""),
            content: decodeString(item.content),
          }))
        );
      })
      .catch(() => message.error("Không thể tải danh sách bài viết"))
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.category === activeTab &&
      (blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "articleId",
      key: "articleId",
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
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags && tags.length > 0 ? (
          <>
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {tags.length > 3 && (
              <span style={{ color: "#1890ff", cursor: "pointer" }}>
                +{tags.length - 3}...
              </span>
            )}
          </>
        ) : null,
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
              onClick={() => {
                setSelectedBlog(record);
                setEditMode(false);
                setShowModal(true);
              }}
              size="small"
            >
              Xem
            </Button>
          </Col>
          <Col>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditBlog(record)}
              size="small"
            >
              Sửa
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => handleDeleteBlog(record.articleId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(true);
    setShowModal(true);
    setEditImage(blog.imgUrl);
    setEditTags(blog.tags);
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      imgUrl: blog.imgUrl,
      tags: blog.tags,
      userName: blog.userName,
    });
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteBloodArticle(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      message.success("Đã xóa bài viết!");
      setShowModal(false);
    } catch {
      message.error("Xóa bài viết thất bại!");
    }
  };

  const handleEditSubmit = () => {
    form.validateFields().then(async (values) => {
      if (!values.title || !values.content) {
        message.error("Tiêu đề và nội dung không được để trống!");
        return;
      }
      try {
        await putBlog(selectedBlog.articleId, {
          ...values,
          tags: Array.isArray(values.tags)
            ? values.tags.join(",")
            : values.tags,
          imgUrl: editImage,
        });
        setBlogs((prev) =>
          prev.map((b) =>
            b.articleId === selectedBlog.articleId
              ? {
                  ...b,
                  ...values,
                  tags: values.tags,
                  imgUrl: editImage,
                  content: values.content,
                }
              : b
          )
        );
        setShowModal(false);
        message.success("Cập nhật bài viết thành công!");
      } catch {
        message.error("Cập nhật bài viết thất bại!");
      }
    });
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý Blog"
        icon={<FileTextOutlined />}
        subtitle="Xem, chỉnh sửa, xóa các bài viết tài liệu và tin tức của hệ thống"
      />
      <Card
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          boxShadow: "0 4px 24px #e6e6e6",
          borderRadius: 16,
          border: "1px solid #f0f0f0",
          background: "#fcfcfc",
        }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo tiêu đề, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={CATEGORY_OPTIONS.map((cat) => ({
            key: cat.value,
            label: (
              <span>
                {cat.icon} {cat.label}
              </span>
            ),
          }))}
        />
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={filteredBlogs}
            rowKey="articleId"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            bordered
            size="large"
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #f0f1f2",
            }}
          />
        </Spin>
      </Card>
      <Modal
        title={
          editMode
            ? "Chỉnh sửa bài viết"
            : selectedBlog
            ? selectedBlog.title
            : ""
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={
          editMode
            ? [
                <Button key="cancel" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditSubmit}>
                  Lưu
                </Button>,
              ]
            : null
        }
        width={700}
      >
        {selectedBlog && !editMode && (
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              {selectedBlog.title}
            </div>
            <div style={{ marginBottom: 8, color: "#888" }}>
              <b>ID:</b> {selectedBlog.articleId} &nbsp;|&nbsp;
              <b>Người viết:</b>{" "}
              {selectedBlog.userName || selectedBlog.author || "-"}{" "}
              &nbsp;|&nbsp;
              <b>Loại:</b> {selectedBlog.category}
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
            <div style={{ marginBottom: 8 }}>
              <b>Tags:</b>{" "}
              {selectedBlog.tags && selectedBlog.tags.length > 0
                ? selectedBlog.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))
                : "-"}
            </div>
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
                <Button onClick={() => setShowModal(false)}>Đóng</Button>
              </Col>
              <Col>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa bài viết này?"
                  onConfirm={() => handleDeleteBlog(selectedBlog.articleId)}
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
        )}
        {selectedBlog && editMode && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ ...selectedBlog }}
            // Bỏ hết rules ràng buộc, cho phép sửa bất kỳ trường nào
          >
            <Form.Item name="title" label="Tiêu đề">
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Nội dung">
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item name="imgUrl" label="Ảnh thumbnail">
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => setEditImage(e.target.result);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                {editImage ? (
                  <img
                    src={editImage}
                    alt="thumbnail"
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <div>Chọn ảnh</div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Select mode="tags" style={{ width: "100%" }} allowClear />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default BlogApproval;
