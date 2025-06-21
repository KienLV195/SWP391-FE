import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import "../../styles/pages/BlogEditor.scss";

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "Tài liệu",
    contentType: "document", // document, news, announcement
    excerpt: "",
    content: "",
    featuredImage: null,
    tags: "",
    status: "draft",
    targetAudience: "public", // public (Guest/Member), internal (staff only)
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Load blog data if editing
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // Mock API call - replace with actual API
      setTimeout(() => {
        const mockBlog = {
          id: parseInt(id),
          title: "Kinh nghiệm hiến máu lần đầu",
          category: "Kinh nghiệm",
          excerpt: "Chia sẻ những điều cần biết khi hiến máu lần đầu...",
          content: `
            <h2>Chuẩn bị trước khi hiến máu</h2>
            <p>Trước khi hiến máu, bạn cần chuẩn bị một số điều sau:</p>
            <ul>
              <li>Ăn uống đầy đủ trước khi hiến máu</li>
              <li>Uống nhiều nước</li>
              <li>Ngủ đủ giấc</li>
              <li>Mang theo giấy tờ tùy thân</li>
            </ul>
            
            <h2>Quy trình hiến máu</h2>
            <p>Quy trình hiến máu thường diễn ra như sau:</p>
            <ol>
              <li>Đăng ký thông tin</li>
              <li>Khám sàng lọc</li>
              <li>Hiến máu</li>
              <li>Nghỉ ngơi và ăn nhẹ</li>
            </ol>
          `,
          tags: "hiến máu, kinh nghiệm, lần đầu",
          status: "draft",
        };

        setFormData(mockBlog);
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        featuredImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleSave = async (status = "draft") => {
    setSaving(true);

    try {
      // Doctor khoa máu tự động duyệt và publish
      const finalStatus = status === "pending" ? "published" : status;

      const blogData = {
        ...formData,
        status: finalStatus,
        updatedAt: new Date().toISOString(),
        publishedAt:
          finalStatus === "published" ? new Date().toISOString() : null,
      };

      // API Call: POST /api/blogs (create) or PUT /api/blogs/{id} (update)
      // Headers: Authorization: Bearer {token}
      // Body: {
      //   title: string,
      //   category: string,
      //   contentType: string,
      //   excerpt: string,
      //   content: string,
      //   featuredImage: File|null,
      //   tags: string,
      //   status: string,
      //   targetAudience: string
      // }
      // Response: { success: boolean, blog: BlogObject, message: string }

      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      alert(
        status === "draft"
          ? "Bài viết đã được lưu thành bản nháp"
          : "Bài viết đã được gửi để duyệt"
      );

      // Navigate back to blog management
      navigate("/doctor/blog");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Có lỗi xảy ra khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết");
      return;
    }
    handleSave("pending");
  };

  const handleSaveDraft = () => {
    handleSave("draft");
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
        <div className="blog-editor">
          <div className="editor-header">
            <div className="header-content">
              <h1>{isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>
              <p>Chia sẻ kiến thức và kinh nghiệm về hiến máu</p>
            </div>

            <div className="header-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate("/doctor/blog")}
                disabled={saving}
              >
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>

              <button
                className="btn-outline"
                onClick={handleSaveDraft}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Lưu nháp
                  </>
                )}
              </button>

              <button
                className="btn-primary"
                onClick={handleSubmitForReview}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <i className="fas fa-globe"></i>
                    Đăng ngay
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="editor-content">
            <div className="editor-main">
              <div className="form-group">
                <label htmlFor="title">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Tóm tắt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Nội dung bài viết *</label>
                <div className="content-editor">
                  <div className="editor-toolbar">
                    <button type="button" className="toolbar-btn" title="Bold">
                      <i className="fas fa-bold"></i>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Italic"
                    >
                      <i className="fas fa-italic"></i>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Underline"
                    >
                      <i className="fas fa-underline"></i>
                    </button>
                    <div className="toolbar-divider"></div>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Heading"
                    >
                      <i className="fas fa-heading"></i>
                    </button>
                    <button type="button" className="toolbar-btn" title="List">
                      <i className="fas fa-list-ul"></i>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Numbered List"
                    >
                      <i className="fas fa-list-ol"></i>
                    </button>
                    <div className="toolbar-divider"></div>
                    <button type="button" className="toolbar-btn" title="Link">
                      <i className="fas fa-link"></i>
                    </button>
                    <button type="button" className="toolbar-btn" title="Image">
                      <i className="fas fa-image"></i>
                    </button>
                  </div>

                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Nhập nội dung bài viết..."
                    rows="15"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="editor-sidebar">
              <div className="sidebar-section">
                <h3>Cài đặt bài viết</h3>

                <div className="form-group">
                  <label htmlFor="category">Danh mục</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Tài liệu">
                      Tài liệu (Hiển thị trên Guest/Member)
                    </option>
                    <option value="Tin tức">
                      Tin tức (Hiển thị trên Guest/Member)
                    </option>
                    <option value="Thông báo">Thông báo nội bộ</option>
                  </select>
                  <small>
                    Bài viết của Doctor khoa máu sẽ được tự động duyệt và đăng
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Đối tượng xem</label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                  >
                    <option value="public">Công khai (Guest & Member)</option>
                    <option value="internal">Nội bộ (Chỉ nhân viên)</option>
                  </select>
                  <small>
                    Bài viết công khai sẽ hiển thị trên trang Guest và Member
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Thẻ tag</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Nhập các tag, cách nhau bằng dấu phẩy"
                  />
                  <small>Ví dụ: hiến máu, kinh nghiệm, sức khỏe</small>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Ảnh đại diện</h3>

                <div className="image-upload">
                  <input
                    type="file"
                    id="featuredImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            featuredImage: null,
                          }));
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="featuredImage"
                      className="upload-placeholder"
                    >
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Chọn ảnh đại diện</span>
                      <small>JPG, PNG tối đa 5MB</small>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
