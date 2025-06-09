import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import blogService from "../../services/blogService";
import authService from "../../services/authService";
import "../../styles/pages/BlogEditor.scss";

const ManagerBlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "Tin tức", // Default to News
    contentType: "news", // news, announcement (NO document)
    excerpt: "",
    content: "",
    featuredImage: null,
    tags: "",
    status: "draft",
    targetAudience: "public", // public for News, internal for Announcements
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadBlog();
    }
  }, [id, isEditMode]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(id);
      if (response.success) {
        setFormData(response.data);
      } else {
        alert("Không thể tải bài viết: " + response.message);
        navigate("/manager/blog");
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      alert("Có lỗi xảy ra khi tải bài viết!");
      navigate("/manager/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-update contentType and targetAudience based on category
    if (field === "category") {
      if (value === "Tin tức") {
        setFormData((prev) => ({
          ...prev,
          category: value,
          contentType: "news",
          targetAudience: "public"
        }));
      } else if (value === "Thông báo") {
        setFormData((prev) => ({
          ...prev,
          category: value,
          contentType: "announcement",
          targetAudience: "internal"
        }));
      }
    }
  };

  const handleSave = async (status = "draft") => {
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert("Vui lòng nhập tiêu đề bài viết!");
        setSaving(false);
        return;
      }

      if (!formData.excerpt.trim()) {
        alert("Vui lòng nhập mô tả ngắn!");
        setSaving(false);
        return;
      }

      if (!formData.content.trim()) {
        alert("Vui lòng nhập nội dung bài viết!");
        setSaving(false);
        return;
      }

      // Manager auto-publishes (no approval needed)
      const finalStatus = status === "pending" ? "published" : status;

      const blogData = {
        ...formData,
        status: finalStatus,
        updatedAt: new Date().toISOString(),
        publishedAt: finalStatus === "published" ? new Date().toISOString() : null,
      };

      const currentUser = authService.getCurrentUser();
      let response;

      if (isEditMode) {
        response = await blogService.updateBlog(id, blogData);
      } else {
        response = await blogService.createBlog(blogData, currentUser.id, 'manager');
      }

      if (response.success) {
        alert(
          isEditMode
            ? "Cập nhật bài viết thành công!"
            : finalStatus === "published"
            ? "Tạo và đăng bài viết thành công!"
            : "Lưu bản nháp thành công!"
        );
        navigate("/manager/blog");
      } else {
        alert("Lỗi: " + response.message);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert("Có lỗi xảy ra khi lưu bài viết!");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất.")) {
      navigate("/manager/blog");
    }
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
        <div className="blog-editor">
          <div className="editor-header">
            <div className="header-content">
              <h1>{isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>
              <p>Manager chỉ có thể đăng Tin tức và Thông báo (không được đăng Tài liệu)</p>
            </div>
            <div className="header-actions">
              <button
                className="btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className="btn-outline"
                onClick={() => handleSave("draft")}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu nháp"}
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave("published")}
                disabled={saving}
              >
                {saving ? "Đang đăng..." : "Đăng ngay"}
              </button>
            </div>
          </div>

          <div className="editor-content">
            <div className="form-section">
              <div className="form-group">
                <label>Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="form-select"
                  >
                    <option value="Tin tức">Tin tức (Hiển thị công khai)</option>
                    <option value="Thông báo">Thông báo nội bộ</option>
                  </select>
                  <small className="form-help">
                    Manager không được phép đăng Tài liệu
                  </small>
                </div>

                <div className="form-group">
                  <label>Đối tượng</label>
                  <input
                    type="text"
                    value={formData.targetAudience === "public" ? "Công khai" : "Nội bộ"}
                    disabled
                    className="form-input disabled"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả ngắn *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Nội dung bài viết *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  className="form-textarea content-editor"
                  rows="15"
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Nhập các tag, cách nhau bằng dấu phẩy..."
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerBlogEditor;
