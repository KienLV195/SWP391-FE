import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../../../styles/pages/admin/BlogManagement.module.scss";

const { Option } = Select;
const { Option } = Select;
const { TextArea } = Input;

const BlogManagement = () => {
  const { blogType } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [form] = Form.useForm();
  const [editingBlog, setEditingBlog] = useState(null);

  const blogTypeLabels = {
    news: "Tin tức",
    documents: "Tài liệu",
  };

  const statusColors = {
    DRAFT: "default",
    PENDING: "warning",
    PUBLISHED: "success",
    REJECTED: "error",
  };

  const statusLabels = {
    DRAFT: "Bản nháp",
    PENDING: "Chờ duyệt",
    PUBLISHED: "Đã xuất bản",
    REJECTED: "Từ chối",
  };

  useEffect(() => {
    fetchBlogs();
  }, [blogType]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/blogs?type=${blogType}`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      message.success("Xóa bài viết thành công");
      fetchBlogs();
    } catch (error) {
      message.error("Không thể xóa bài viết");
    }
  };

  const handlePreview = (record) => {
    setPreviewBlog(record);
    setPreviewVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBlog) {
        // Update existing blog
        // TODO: Replace with actual API call
        await fetch(`/api/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Cập nhật bài viết thành công");
      } else {
        // Create new blog
        // TODO: Replace with actual API call
        await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, type: blogType }),
        });
        message.success("Tạo bài viết thành công");
      }
      setModalVisible(false);
      fetchBlogs();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/blogs/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      message.success("Cập nhật trạng thái thành công");
      fetchBlogs();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          {text}
          {record.featured && <Tag color="gold">Nổi bật</Tag>}
        </Space>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            Xem trước
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.blogManagement}>
      <div className={styles.header}>
        <h1>Quản lý {blogTypeLabels[blogType]}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        loading={loading}
        rowKey="id"
        pagination={{
          total: blogs.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài viết`,
        }}
      />

      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <ReactQuill
              theme="snow"
              style={{ height: 300, marginBottom: 50 }}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="DRAFT">
            <Select>
              <Option value="DRAFT">Bản nháp</Option>
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="PUBLISHED">Xuất bản</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="featured"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Đánh dấu bài viết nổi bật</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBlog ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xem trước bài viết"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={null}
      >
        {previewBlog && (
          <div className={styles.preview}>
            <h1>{previewBlog.title}</h1>
            <div className={styles.meta}>
              <span>Tác giả: {previewBlog.author}</span>
              <span>
                Ngày tạo:{" "}
                {new Date(previewBlog.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <Tag color={statusColors[previewBlog.status]}>
                {statusLabels[previewBlog.status]}
              </Tag>
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement;
