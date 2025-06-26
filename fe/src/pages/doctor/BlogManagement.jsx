import React, { useState, useEffect } from "react";
import { Form } from "antd";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import blogService from "../../services/blogService";
import "../../styles/pages/BlogManagement.scss";
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Modal,
  message,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BlogEditModal from "../../components/admin/blogs/BlogEditModal";
import BlogDetailModal from "../../components/admin/blogs/BlogDetailModal";
import authService from "../../services/authService";
import * as bloodArticleService from "../../services/bloodArticleService";

const { Option } = Select;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("Tài liệu");
  const currentUser = authService.getCurrentUser();
  const [articleLoading, setArticleLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  // Mock data - replace with API calls
  // API: GET /api/blogs?author_id={user_id}&role={user_role}
  useEffect(() => {
    const mockBlogs = [
      {
        id: 1,
        title: "Hướng dẫn chuẩn bị trước khi hiến máu",
        category: "Tài liệu",
        contentType: "document", // For Guest/Member "Tài liệu" section
        status: "published",
        author: "BS. Nguyễn Văn A",
        authorRole: "doctor",
        createdAt: "2024-01-15",
        views: 245,
        excerpt:
          "Hướng dẫn chi tiết các bước chuẩn bị cần thiết trước khi hiến máu...",
        targetAudience: "public", // Will show on Guest/Member pages
      },
      {
        id: 2,
        title: "Thông tin về các nhóm máu và tính tương thích",
        category: "Tài liệu",
        contentType: "document",
        status: "published",
        author: "BS. Trần Thị B",
        authorRole: "doctor",
        createdAt: "2024-01-12",
        views: 189,
        excerpt:
          "Kiến thức cơ bản về nhóm máu ABO, Rh và tính tương thích trong truyền máu...",
        targetAudience: "public",
      },
      {
        id: 3,
        title: "Tin tức: Chiến dịch hiến máu tháng 2/2024",
        category: "Tin tức",
        contentType: "news", // For Guest/Member "Tin tức" section
        status: "draft",
        author: "BS. Lê Văn C",
        authorRole: "doctor",
        createdAt: "2024-01-10",
        views: 0,
        excerpt: "Bệnh viện Ánh Dương tổ chức chiến dịch hiến máu nhân đạo...",
        targetAudience: "public",
      },
      {
        id: 4,
        title: "Thông báo: Lịch trực khoa Huyết học tháng 2/2024",
        category: "Thông báo",
        contentType: "announcement",
        status: "published", // Doctor auto-publishes
        author: "BS. Phạm Thị D",
        authorRole: "doctor",
        createdAt: "2024-01-08",
        publishedAt: "2024-01-08T09:00:00Z",
        views: 89,
        excerpt:
          "Thông báo lịch trực và phân công công việc cho khoa Huyết học...",
        targetAudience: "internal", // Staff only
      },
    ];

    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  // Fetch articles for 'Tài liệu' tab from API
  useEffect(() => {
    if (activeTab === "Tài liệu") {
      setArticleLoading(true);
      bloodArticleService
        .getBloodArticles()
        .then((data) => {
          setArticles(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          message.error("Không thể tải danh sách tài liệu");
        })
        .finally(() => setArticleLoading(false));
    }
  }, [activeTab]);

  // Filter blogs by tab/category
  const tabCategories = [
    { key: "Tài liệu", label: "Tài liệu" },
    { key: "Tin tức", label: "Tin tức" },
  ];

  const getFilteredBlogs = (category) =>
    blogs.filter(
      (blog) =>
        blog.category === category &&
        (searchTerm === "" ||
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || blog.status === statusFilter)
    );

  const getColumns = (category) => [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a onClick={() => handleViewBlog(record)}>{text}</a>
      ),
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "published" ? (
          <Tag color="green">Đã đăng</Tag>
        ) : (
          <Tag color="orange">Bản nháp</Tag>
        ),
      width: 100,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 140,
    },
    {
      title: category === "Tin tức" ? "Ngày đăng" : "Ngày tạo",
      dataIndex: category === "Tin tức" ? "postedAt" : "createdAt",
      key: category === "Tin tức" ? "postedAt" : "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
      width: 110,
      sorter: (a, b) =>
        new Date(a[category === "Tin tức" ? "postedAt" : "createdAt"]) -
        new Date(b[category === "Tin tức" ? "postedAt" : "createdAt"]),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      width: 90,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => {
        const isOwner =
          currentUser &&
          (record.userId === currentUser.id ||
            record.author === currentUser.name);
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewBlog(record)}
              size="small"
            />
            {isOwner && (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditBlog(record)}
                size="small"
              />
            )}
            {isOwner && (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteBlog(record.id)}
                danger
                size="small"
              />
            )}
          </Space>
        );
      },
    },
  ];

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setEditImage(null);
    setEditModalVisible(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditImage(blog.imgUrl || null);
    setEditModalVisible(true);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setDetailModalVisible(true);
  };

  const handleDeleteBlog = async (blogId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await blogService.deleteBlog(blogId);
          if (response.success) {
            setBlogs((prev) => prev.filter((b) => b.id !== blogId));
            message.success("Xóa bài viết thành công!");
          } else {
            message.error("Lỗi: " + response.message);
          }
        } catch {
          message.error("Có lỗi xảy ra khi xóa bài viết!");
        }
      },
    });
  };

  // For 'Tài liệu' tab, use articles from API
  const getFilteredArticles = () =>
    articles.filter(
      (article) =>
        (searchTerm === "" ||
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.tags || [])
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || article.status === statusFilter)
    );

  const getArticleColumns = () => [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a onClick={() => handleViewArticle(record)}>{text}</a>
      ),
      ellipsis: true,
    },
    {
      title: "Tác giả",
      dataIndex: "userId",
      key: "userId",
      width: 100,
      render: (userId) => userId,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
      width: 110,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (tags || []).map((tag, i) => <Tag key={i}>{tag}</Tag>),
      width: 180,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => {
        const isOwner = currentUser && record.userId === currentUser.id;
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewArticle(record)}
              size="small"
            />
            {isOwner && (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditArticle(record)}
                size="small"
              />
            )}
            {isOwner && (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteArticle(record.articleId)}
                danger
                size="small"
              />
            )}
          </Space>
        );
      },
    },
  ];

  // Handlers for article actions
  const handleCreateArticle = () => {
    setSelectedBlog({});
    setEditImage(null);
    setEditModalVisible(true);
  };
  const handleEditArticle = (article) => {
    setSelectedBlog(article);
    setEditImage(article.imgUrl || null);
    setEditModalVisible(true);
  };
  const handleViewArticle = (article) => {
    setSelectedBlog(article);
    setDetailModalVisible(true);
  };
  const handleDeleteArticle = async (articleId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await bloodArticleService.deleteArticle(articleId);
          setArticles((prev) => prev.filter((a) => a.articleId !== articleId));
          message.success("Xóa bài viết thành công!");
        } catch {
          message.error("Có lỗi xảy ra khi xóa bài viết!");
        }
      },
    });
  };

  if (loading) {
    return (
      <DoctorLayout pageTitle="Quản lý Blog">
        <div className="doctor-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout
      pageTitle="Quản lý Blog"
      pageDescription="Tạo, chỉnh sửa và quản lý các bài viết tài liệu, tin tức, thông báo của khoa Huyết học."
      pageActions={[
        {
          label: "Tạo bài viết mới",
          icon: <PlusOutlined />,
          type: "primary",
          onClick:
            activeTab === "Tài liệu" ? handleCreateArticle : handleCreateBlog,
        },
      ]}
    >
      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabCategories.map((tab) => ({
            key: tab.key,
            label: tab.label,
            children:
              tab.key === "Tài liệu" ? (
                <>
                  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
                    <Input.Search
                      placeholder="Tìm kiếm bài viết..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 260 }}
                      allowClear
                    />
                  </Space>
                  <Table
                    columns={getArticleColumns()}
                    dataSource={getFilteredArticles()}
                    rowKey="articleId"
                    loading={articleLoading}
                    pagination={{ pageSize: 8 }}
                    bordered
                  />
                </>
              ) : (
                <>
                  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
                    <Input.Search
                      placeholder="Tìm kiếm bài viết..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 260 }}
                      allowClear
                    />
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 150 }}
                    >
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="published">Đã đăng</Option>
                      <Option value="draft">Bản nháp</Option>
                    </Select>
                  </Space>
                  <Table
                    columns={getColumns(tab.key)}
                    dataSource={getFilteredBlogs(tab.key)}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                    bordered
                  />
                </>
              ),
          }))}
        />
      </Card>
      <BlogEditModal
        visible={editModalVisible}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        editImage={editImage}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={async () => {
          try {
            const values = await form.validateFields();
            if (selectedBlog && selectedBlog.articleId) {
              // Edit
              await bloodArticleService.updateBlog(selectedBlog.articleId, {
                ...values,
                imgUrl: editImage,
                userId: currentUser.id,
              });
              message.success("Cập nhật bài viết thành công!");
            } else {
              // Create
              await bloodArticleService.updateBlog("", {
                ...values,
                imgUrl: editImage,
                userId: currentUser.id,
              });
              message.success("Tạo bài viết thành công!");
            }
            setEditModalVisible(false);
            // Refresh list
            const data = await bloodArticleService.getBloodArticles();
            setArticles(Array.isArray(data) ? data : []);
          } catch {
            message.error("Có lỗi xảy ra khi lưu bài viết!");
          }
        }}
        onImageChange={setEditImage}
        form={form}
      />
      <BlogDetailModal
        visible={detailModalVisible}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        userMap={{}}
        onClose={() => setDetailModalVisible(false)}
        onDelete={(id) => {
          setDetailModalVisible(false);
          handleDeleteArticle(id);
        }}
      />
    </DoctorLayout>
  );
};

export default BlogManagement;
