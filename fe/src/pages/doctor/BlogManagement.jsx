import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import { useAuth } from "../../contexts/AuthContext";
import blogService from "../../services/blogService";
import "../../styles/pages/BlogManagement.scss";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || blog.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: "Đã đăng", class: "status-published" },
      draft: { label: "Bản nháp", class: "status-draft" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  const handleCreateBlog = () => {
    navigate("/doctor/blog/create");
  };

  const handleEditBlog = (blogId) => {
    navigate(`/doctor/blog/edit/${blogId}`);
  };

  const handleViewBlog = (blogId) => {
    navigate(`/doctor/blog/view/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await blogService.deleteBlog(blogId);
        if (response.success) {
          setBlogs(blogs.filter((blog) => blog.id !== blogId));
          alert("Xóa bài viết thành công!");
        } else {
          alert("Lỗi: " + response.message);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Có lỗi xảy ra khi xóa bài viết!");
      }
    }
  };

  if (loading) {
    return (
      <div className="doctor-layout">
        <DoctorSidebar />
        <div className="doctor-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div className="blog-management">
          <div className="page-header">
            <div className="header-content">
              <h1>Quản lý Blog</h1>
              <p>
                Tạo và quản lý Tài liệu, Tin tức, Thông báo (tự động đăng không
                cần duyệt)
              </p>
            </div>
            <button className="btn-primary" onClick={handleCreateBlog}>
              <i className="fas fa-plus"></i>
              Tạo bài viết mới
            </button>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã đăng</option>
                <option value="draft">Bản nháp</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Tài liệu">
                  Tài liệu (Hiển thị trên Guest/Member)
                </option>
                <option value="Tin tức">
                  Tin tức (Hiển thị trên Guest/Member)
                </option>
                <option value="Thông báo">Thông báo nội bộ</option>
              </select>
            </div>
          </div>

          <div className="blogs-grid">
            {filteredBlogs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-blog"></i>
                <h3>Chưa có bài viết nào</h3>
                <p>Hãy tạo bài viết đầu tiên để chia sẻ kinh nghiệm của bạn</p>
                <button className="btn-primary" onClick={handleCreateBlog}>
                  Tạo bài viết mới
                </button>
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-header">
                    <div className="blog-meta">
                      <span className="category">{blog.category}</span>
                      {getStatusBadge(blog.status)}
                    </div>
                    <div className="blog-actions">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewBlog(blog.id)}
                        title="Xem bài viết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      {/* Doctor can edit all blogs (draft and published) */}
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditBlog(blog.id)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteBlog(blog.id)}
                        title="Xóa bài viết"
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                      {/* Show auto-publish badge for published blogs */}
                      {blog.status === "published" && (
                        <span className="auto-published-badge">
                          <i className="fas fa-check-circle"></i>
                          Tự động đăng
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  </div>

                  <div className="blog-footer">
                    <div className="blog-info">
                      <span className="author">
                        <i className="fas fa-user"></i>
                        {blog.author}
                      </span>
                      <span className="date">
                        <i className="fas fa-calendar"></i>
                        {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="views">
                        <i className="fas fa-eye"></i>
                        {blog.views} lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
