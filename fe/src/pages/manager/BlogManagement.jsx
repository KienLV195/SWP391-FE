import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import blogService from "../../services/blogService";
import authService from "../../services/authService";
import "../../styles/pages/BlogManagement.scss";

const ManagerBlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const response = await blogService.getBlogsByAuthor(currentUser.id);
      
      if (response.success) {
        setBlogs(response.data);
      } else {
        console.error('Failed to load blogs:', response.message);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;

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
    navigate("/manager/blog/create");
  };

  const handleEditBlog = (blogId) => {
    navigate(`/manager/blog/edit/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await blogService.deleteBlog(blogId);
        if (response.success) {
          setBlogs(blogs.filter(blog => blog.id !== blogId));
          alert("Xóa bài viết thành công!");
        } else {
          alert("Lỗi: " + response.message);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert("Có lỗi xảy ra khi xóa bài viết!");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="manager-layout">
        <ManagerSidebar />
        <div className="manager-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-layout">
      <ManagerSidebar />
      <div className="manager-content">
        <div className="blog-management">
          <div className="page-header">
            <div className="header-content">
              <h1>Quản lý Blog</h1>
              <p>Tạo và quản lý Tin tức & Thông báo nội bộ (không được đăng Tài liệu)</p>
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
                <option value="Tin tức">Tin tức (Hiển thị công khai)</option>
                <option value="Thông báo">Thông báo nội bộ</option>
              </select>
            </div>
          </div>

          <div className="blogs-grid">
            {filteredBlogs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-blog"></i>
                <h3>Chưa có bài viết nào</h3>
                <p>Hãy tạo bài viết đầu tiên để chia sẻ tin tức hoặc thông báo</p>
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
                        className="action-btn edit"
                        onClick={() => handleEditBlog(blog.id)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteBlog(blog.id)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-stats">
                      <span className="stat">📅 {formatDate(blog.createdAt)}</span>
                      <span className="stat">👁️ {blog.views || 0} lượt xem</span>
                      <span className="stat">❤️ {blog.likes || 0} lượt thích</span>
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

export default ManagerBlogManagement;
