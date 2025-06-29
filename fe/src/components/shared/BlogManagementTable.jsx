import React from "react";
import { Form, Tabs, Input } from "antd";
import {
  FileTextOutlined,
  NotificationOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BlogEditModal from "../admin/blogs/BlogEditModal";
import BlogDetailModal from "../admin/blogs/BlogDetailModal";
import { useBlogManagement } from "../../hooks/useBlogManagement";
import authService from "../../services/authService";

const { Search } = Input;

const BlogManagementTable = ({
  layout: Layout,
  tableComponent: TableComponent,
  columnsConfig,
  showActivityLogs = false,
}) => {
  const [form] = Form.useForm();

  // Lấy currentUser từ authService, nếu null thì lấy từ localStorage
  let currentUser = authService.getCurrentUser();
  if (!currentUser) {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error loading currentUser from localStorage:", error);
    }
  }

  const {
    activeTab,
    dateFilter,
    selectedBlog,
    showModal,
    editMode,
    editImage,
    userMap,
    searchTerm,
    loading,
    CATEGORY_OPTIONS,
    filteredData,
    setActiveTab,
    setDateFilter,
    setEditImage,
    setSearchTerm,
    handleEditBlog,
    handleViewBlog,
    handleDeleteBlog,
    handleEditSubmit,
    handleCloseModal,
  } = useBlogManagement(showActivityLogs, currentUser);

  const handleModalSubmit = async () => {
    try {
      await handleEditSubmit(form);
    } catch (error) {
      console.error("Modal submit error:", error);
      // Đảm bảo modal đóng ngay cả khi có lỗi
      handleCloseModal();
    }
  };

  // Get columns based on active tab
  const getColumns = () => {
    return columnsConfig({
      activeTab,
      userMap: activeTab === "Theo dõi hoạt động" ? null : userMap,
      onView: handleViewBlog,
      onEdit: handleEditBlog,
      onDelete: handleDeleteBlog,
    });
  };

  return (
    <Layout>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={CATEGORY_OPTIONS.map((cat) => ({
          key: cat.value,
          label: (
            <span>
              {cat.value === "Tài liệu" ? (
                <FileTextOutlined />
              ) : cat.value === "Tin tức" ? (
                <NotificationOutlined />
              ) : (
                <HistoryOutlined />
              )}{" "}
              {cat.label}
            </span>
          ),
        }))}
      />

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder={
            activeTab === "Theo dõi hoạt động"
              ? "Tìm kiếm hoạt động..."
              : "Tìm kiếm bài viết..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 8 }}
          allowClear
        />

        {(activeTab === "Tin tức" ||
          activeTab === "Tài liệu" ||
          activeTab === "Theo dõi hoạt động") && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="date"
              value={dateFilter ? dateFilter.format("YYYY-MM-DD") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setDateFilter(dayjs(e.target.value));
                } else {
                  setDateFilter(null);
                }
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: 6,
              }}
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter(null)}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Xóa lọc ngày
              </button>
            )}
          </div>
        )}
      </div>

      <TableComponent
        key={activeTab}
        columns={getColumns()}
        data={filteredData}
        loading={loading}
        rowKey={
          activeTab === "Tài liệu"
            ? "articleId"
            : activeTab === "Tin tức"
            ? "postId"
            : "logId"
        }
      />

      {/* Detail Modal */}
      <BlogDetailModal
        visible={showModal && !editMode}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        userMap={activeTab === "Theo dõi hoạt động" ? null : userMap}
        onClose={handleCloseModal}
        onDelete={handleDeleteBlog}
      />

      {/* Edit Modal */}
      <BlogEditModal
        visible={showModal && editMode}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        editImage={editImage}
        onCancel={handleCloseModal}
        onSubmit={handleModalSubmit}
        onImageChange={setEditImage}
        form={form}
      />
    </Layout>
  );
};

export default BlogManagementTable;
