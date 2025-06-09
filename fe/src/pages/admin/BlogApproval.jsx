import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import blogService from "../../services/blogService";
import "../../styles/pages/BlogApproval.scss";

const BlogApproval = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load published blogs for admin monitoring
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogsForAdmin({
        category: categoryFilter,
        search: searchTerm,
      });

      if (response.success) {
        setBlogs(response.data);
      } else {
        console.error("Failed to load blogs:", response.message);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    loadBlogs();
  }, [categoryFilter, searchTerm]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || blog.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handlePreviewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowPreviewModal(true);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Tài liệu":
        return "#007bff";
      case "Tin tức":
        return "#28a745";
      case "Thông báo":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const getAuthorRoleText = (role) => {
    switch (role) {
      case "doctor":
        return "Bác sĩ";
      case "manager":
        return "Quản lý";
      default:
        return "Khác";
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="blog-approval-page">
          <div className="page-header">
            <div className="header-content">
              <h1>Quản lý Blog</h1>
              <p>
                Xem và xóa các bài viết đã đăng từ Doctor/Manager (tự động đăng)
              </p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {blogs.filter((b) => b.category === "Tài liệu").length}
                </span>
                <span className="stat-label">Tài liệu</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {blogs.filter((b) => b.category === "Tin tức").length}
                </span>
                <span className="stat-label">Tin tức</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {blogs.filter((b) => b.category === "Thông báo").length}
                </span>
                <span className="stat-label">Thông báo</span>
              </div>
            </div>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Tài liệu">Tài liệu</option>
                <option value="Tin tức">Tin tức</option>
                <option value="Thông báo">Thông báo</option>
              </select>
            </div>
          </div>

          <div className="blogs-grid">
            {filteredBlogs.length === 0 ? (
              <div className="no-blogs">
                <p>Không có bài viết nào được tìm thấy.</p>
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-header">
                    <div className="blog-meta">
                      <span
                        className="category-badge"
                        style={{
                          backgroundColor: getCategoryColor(blog.category),
                        }}
                      >
                        {blog.category}
                      </span>
                      <span className="author-info">
                        {blog.author} ({getAuthorRoleText(blog.authorRole)})
                      </span>
                    </div>
                    <div className="blog-date">
                      {formatDate(blog.publishedAt)}
                    </div>
                  </div>

                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>

                    <div className="blog-stats">
                      <span className="stat">
                        👁️ {blog.views || 0} lượt xem
                      </span>
                      <span className="stat">
                        ❤️ {blog.likes || 0} lượt thích
                      </span>
                    </div>
                  </div>

                  <div className="blog-actions">
                    <button
                      className="action-btn preview"
                      onClick={() => handlePreviewBlog(blog)}
                      title="Xem trước"
                    >
                      <i className="fas fa-eye"></i>
                    </button>

                    <span className="auto-published-badge">
                      <i className="fas fa-check-circle"></i>
                      Tự động đăng
                    </span>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteBlog(blog.id)}
                      title="Xóa bài viết"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && selectedBlog && (
          <div
            className="modal-overlay"
            onClick={() => setShowPreviewModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Xem trước bài viết</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowPreviewModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="blog-preview">
                  <div className="preview-meta">
                    <span className="category">{selectedBlog.category}</span>
                    <span className="author">{selectedBlog.author}</span>
                    <span className="date">
                      {formatDate(selectedBlog.publishedAt)}
                    </span>
                  </div>
                  <h1 className="preview-title">{selectedBlog.title}</h1>
                  <div className="preview-excerpt">{selectedBlog.excerpt}</div>
                  <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Đóng
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    handleDeleteBlog(selectedBlog.id);
                    setShowPreviewModal(false);
                  }}
                >
                  Xóa bài viết
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogApproval;
