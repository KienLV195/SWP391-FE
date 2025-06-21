import React from "react";
import { Form } from "antd";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/shared/AdminCard";
import AdminTable from "../../components/admin/shared/AdminTable";
import BlogTableColumns from "../../components/admin/blogs/BlogTableColumns";
import BlogDetailModal from "../../components/admin/blogs/BlogDetailModal";
import BlogEditModal from "../../components/admin/blogs/BlogEditModal";
import { useBlogApproval } from "../../hooks/useBlogApproval";
import { Tabs } from "antd";
import { FileTextOutlined, NotificationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const BlogApproval = () => {
  const [form] = Form.useForm();

  const {
    activeTab,
    dateFilter,
    selectedBlog,
    showModal,
    editMode,
    editImage,
    userMap,
    searchTerm,
    filteredItems,
    currentLoading,
    CATEGORY_OPTIONS,
    setActiveTab,
    setDateFilter,
    setEditImage,
    handleEditBlog,
    handleDeleteBlog,
    handleEditSubmit,
    handleViewBlog,
    handleCloseModal,
    setSearchTerm,
  } = useBlogApproval();

  const handleModalSubmit = () => {
    handleEditSubmit(form);
  };

  const columns = BlogTableColumns({
    activeTab,
    userMap,
    onView: handleViewBlog,
    onEdit: handleEditBlog,
    onDelete: handleDeleteBlog,
  });

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý Blog"
        icon={<FileTextOutlined />}
        subtitle="Xem, chỉnh sửa, xóa các bài viết tài liệu và tin tức của hệ thống"
      />

      <AdminCard>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={CATEGORY_OPTIONS.map((cat) => ({
            key: cat.value,
            label: (
              <span>
                {cat.value === "Tài liệu" ? (
                  <FileTextOutlined />
                ) : (
                  <NotificationOutlined />
                )}{" "}
                {cat.label}
              </span>
            ),
          }))}
        />

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 300,
              padding: "8px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          {activeTab === "Tin tức" && (
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

        <AdminTable
          columns={columns}
          data={filteredItems}
          loading={currentLoading}
          rowKey={activeTab === "Tài liệu" ? "articleId" : "postId"}
        />
      </AdminCard>

      {/* Detail Modal */}
      <BlogDetailModal
        visible={showModal && !editMode}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        userMap={userMap}
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
    </AdminLayout>
  );
};

export default BlogApproval;
