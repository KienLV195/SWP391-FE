import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import styles from "../../../styles/pages/admin/UserManagement.module.scss";

const { Option } = Select;

const UserManagement = () => {
  const { userType } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  // Map userType to role
  const roleMap = {
    members: "MEMBER",
    "blood-doctors": "BLOOD_DOCTOR",
    "other-doctors": "OTHER_DOCTOR",
    managers: "MANAGER",
  };

  const roleLabels = {
    MEMBER: "Thành viên",
    BLOOD_DOCTOR: "Bác sĩ khoa máu",
    OTHER_DOCTOR: "Bác sĩ khoa khác",
    MANAGER: "Quản lý",
  };

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users?role=${roleMap[userType]}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      message.error("Không thể xóa người dùng");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Update existing user
        // TODO: Replace with actual API call
        await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Cập nhật người dùng thành công");
      } else {
        // Create new user
        // TODO: Replace with actual API call
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, role: roleMap[userType] }),
        });
        message.success("Tạo người dùng thành công");
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="ACTIVE">Hoạt động</Option>
          <Option value="INACTIVE">Không hoạt động</Option>
          <Option value="SUSPENDED">Tạm khóa</Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>Quản lý {roleLabels[roleMap[userType]]}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} người dùng`,
        }}
      />

      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: !editingUser, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
            <Select>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
              <Option value="SUSPENDED">Tạm khóa</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
