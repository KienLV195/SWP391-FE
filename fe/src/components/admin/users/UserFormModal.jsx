import React, { useState } from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const UserFormModal = ({
  visible,
  onOk,
  onCancel,
  editingUser,
  form,
  statusOptions,
  departments = [],
}) => {
  const [selectedRole, setSelectedRole] = useState(
    editingUser ? editingUser.roleID : undefined
  );

  return (
    <Modal
      title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingUser ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          editingUser || {
            status: "active",
          }
        }
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="roleID"
          label="Vai trò"
          rules={[{ required: true, message: "Chọn vai trò" }]}
        >
          <Select onChange={setSelectedRole} value={selectedRole}>
            {editingUser && <Option value={1}>Thành viên</Option>}
            <Option value={2}>Bác sĩ</Option>
            <Option value={3}>Quản lý</Option>
            <Option value={4}>Quản trị viên</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Chọn trạng thái" }]}
          extra={
            <span style={{ color: "#888", fontSize: 12 }}>
              Trạng thái "Cấm" sẽ ngăn người dùng đăng nhập.
            </span>
          }
        >
          <Select>
            {statusOptions.map((s) => (
              <Option key={s.value} value={s.value}>
                {s.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedRole === 2 && (
          <Form.Item
            name="department"
            label="Khoa"
            rules={[
              { required: true, message: "Vui lòng chọn khoa cho bác sĩ" },
            ]}
          >
            <Select showSearch placeholder="Chọn khoa">
              {departments.map((dep) => (
                <Option key={dep} value={dep}>
                  {dep}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserFormModal;
