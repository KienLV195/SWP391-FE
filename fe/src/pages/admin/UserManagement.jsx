import React from "react";
import { Form } from "antd";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/shared/AdminCard";
import AdminTable from "../../components/admin/shared/AdminTable";
import AdminFilterBar from "../../components/admin/shared/AdminFilterBar";
import DeleteConfirmModal from "../../components/admin/shared/DeleteConfirmModal";
import UserFormModal from "../../components/admin/users/UserFormModal";
import UserTableColumns from "../../components/admin/users/UserTableColumns";
import { useUserManagement } from "../../hooks/useUserManagement";
import { TeamOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const [form] = Form.useForm();

  const {
    users,
    loading,
    searchTerm,
    roleFilter,
    statusFilter,
    showModal,
    editingUser,
    deleteModalVisible,
    STATUS_OPTIONS,
    DEPARTMENTS,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setShowModal,
    setDeleteModalVisible,
    handleEditUser,
    handleCreateUser,
    handleDeleteUser,
    handleModalOk,
    handleDeleteClick,
  } = useUserManagement();

  const roleOptions = [
    { value: "all", label: "Tất cả vai trò" },
    { value: "member", label: "Thành viên" },
    { value: "doctor_blood", label: "Bác sĩ - Khoa Huyết học" },
    { value: "doctor_other", label: "Bác sĩ - Khoa khác" },
    { value: "manager", label: "Quản lý" },
    { value: "admin", label: "Quản trị viên" },
  ];

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
  ];

  const filters = [
    {
      value: roleFilter,
      onChange: setRoleFilter,
      placeholder: "Chọn vai trò",
      options: roleOptions,
    },
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Chọn trạng thái",
      options: statusOptions,
    },
  ];

  const columns = UserTableColumns({
    onEdit: handleEditUser,
    onDelete: handleDeleteClick,
  });

  const handleModalSubmit = () => {
    form
      .validateFields()
      .then((values) => handleModalOk(form, values))
      .catch(() => {});
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý người dùng"
        icon={<TeamOutlined />}
        subtitle="Thêm, chỉnh sửa, tìm kiếm và phân quyền người dùng trong hệ thống"
      />

      <AdminCard>
        <AdminFilterBar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Tìm kiếm theo tên hoặc email"
          filters={filters}
          onAdd={handleCreateUser}
          addButtonText="Thêm người dùng"
        />

        <AdminTable
          columns={columns}
          data={users}
          loading={loading}
          rowKey="id"
        />
      </AdminCard>

      <UserFormModal
        visible={showModal}
        onOk={handleModalSubmit}
        onCancel={() => setShowModal(false)}
        editingUser={editingUser}
        form={form}
        statusOptions={STATUS_OPTIONS}
        departments={DEPARTMENTS}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setDeleteModalVisible(false)}
        title="Xác nhận xoá người dùng"
        content="Bạn có chắc chắn muốn xoá người dùng này không?"
      />
    </AdminLayout>
  );
};

export default UserManagement;
