import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Badge,
  Spin,
  Avatar,
  Row,
  Col,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  fetchUsersFromApi,
  postUserToApi,
  deleteUserFromApi,
  fetchUsersFromApiForce,
  updateUserToApi,
} from "../../services/userApi";

const { Option } = Select;

const ROLE_MAP = {
  1: { value: "member", label: "Thành viên" },
  2: { value: "doctor", label: "Bác sĩ" },
  3: { value: "manager", label: "Quản lý" },
  4: { value: "admin", label: "Quản trị viên" },
};

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "suspended", label: "Tạm khóa" },
  { value: "banned", label: "Cấm" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsersFromApi()
      .then((data) => {
        const mapped = (Array.isArray(data) ? data : []).map((u) => {
          const roleObj = ROLE_MAP[u.roleID] || ROLE_MAP[1];
          let role = roleObj.value;
          let roleLabel = roleObj.label;
          // Nếu là bác sĩ, phân biệt theo department
          if (role === "doctor") {
            if (u.department && u.department.toLowerCase().includes("máu")) {
              role = "doctor_blood";
              roleLabel = "Bác sĩ - Khoa máu";
            } else if (u.department) {
              role = `doctor_other_${u.department}`;
              roleLabel = `Bác sĩ - ${u.department}`;
            } else {
              role = "doctor_other";
              roleLabel = "Bác sĩ";
            }
          }
          return {
            id: u.userID, // luôn lấy userID từ backend
            userID: u.userID, // có thể dùng cho cột riêng nếu cần
            name: u.fullName || u.name || "",
            email: u.email || "",
            phone: u.phoneNumber || u.phone || "",
            role,
            roleLabel,
            status: u.status === 1 ? "active" : "inactive",
            bloodType: u.bloodGroup || u.bloodType || "",
            department: u.department || "",
            createdAt: u.createdAt || "",
          };
        });
        setUsers(mapped);
      })
      .catch(() => {
        message.error("Không thể tải dữ liệu người dùng từ API!");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => id,
    },
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar icon={<UserOutlined />} style={{ background: "#1890ff" }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{record.email}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_, record) => <Badge color="blue" text={record.roleLabel} />,
      filters: [
        { text: "Thành viên", value: "member" },
        { text: "Bác sĩ - Khoa máu", value: "doctor_blood" },
        { text: "Bác sĩ - Khoa khác", value: "doctor_other" },
        { text: "Quản lý", value: "manager" },
        { text: "Quản trị viên", value: "admin" },
      ],
      onFilter: (value, record) => record.role.startsWith(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const found = STATUS_OPTIONS.find((s) => s.value === status);
        let color = "default";
        if (status === "active") color = "green";
        if (status === "suspended") color = "orange";
        if (status === "banned") color = "red";
        if (status === "inactive") color = "gray";
        return <Badge color={color} text={found ? found.label : status} />;
      },
      filters: STATUS_OPTIONS.map((s) => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thông tin bổ sung",
      key: "extra",
      render: (_, record) => (
        <div>
          {record.bloodType && <div>Nhóm máu: {record.bloodType}</div>}
          {record.department && <div>Khoa: {record.department}</div>}
        </div>
      ),
    },
    {
      title: "Ngày tạo tài khoản",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : ""),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Row gutter={8}>
          <Col>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              size="small"
            />
          </Col>
          <Col>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => {
                setDeleteUserId(record.id);
                setDeleteModalVisible(true);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  // CRUD handlers
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
    form.setFieldsValue(user);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
    form.resetFields();
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleteModalVisible(false);
    setDeleteUserId(null);
    try {
      setLoading(true);
      await deleteUserFromApi(deleteUserId);
      // Force reload danh sách user, tránh cache
      const data = await fetchUsersFromApiForce();
      const mapped = (Array.isArray(data) ? data : []).map((u) => {
        const roleObj = ROLE_MAP[u.roleID] || ROLE_MAP[1];
        let role = roleObj.value;
        let roleLabel = roleObj.label;
        if (role === "doctor") {
          if (u.department && u.department.toLowerCase().includes("máu")) {
            role = "doctor_blood";
            roleLabel = "Bác sĩ - Khoa máu";
          } else if (u.department) {
            role = `doctor_other_${u.department}`;
            roleLabel = `Bác sĩ - ${u.department}`;
          } else {
            role = "doctor_other";
            roleLabel = "Bác sĩ";
          }
        }
        return {
          id: u.userID,
          userID: u.userID,
          name: u.fullName || u.name || "",
          email: u.email || "",
          phone: u.phoneNumber || u.phone || "",
          role,
          roleLabel,
          status: u.status === 1 ? "active" : "inactive",
          bloodType: u.bloodGroup || u.bloodType || "",
          department: u.department || "",
          createdAt: u.createdAt || "",
        };
      });
      setUsers(mapped);
      message.success("Đã xóa người dùng!");
    } catch {
      message.error("Lỗi khi xóa người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (editingUser) {
          try {
            setLoading(true);
            // Build userData đầy đủ từ editingUser và values
            const userData = {
              name: values.name,
              email: values.email,
              phone: values.phone,
              roleID: Number(values.roleID),
              status: values.status === "active" ? 1 : 0,
              bloodGroup: values.bloodType || editingUser.bloodType || "",
              department: values.department || editingUser.department || "",
              // Các trường bắt buộc bổ sung, lấy từ editingUser hoặc giá trị mặc định
              password: editingUser.password || "Ab1234@", // Nếu không có password cũ, dùng mặc định
              city: editingUser.city || "",
              ward: editingUser.ward || "",
              gender: editingUser.gender || "Male",
              idCard: editingUser.idCard || "",
              rhType: editingUser.rhType || "Rh+",
              address: editingUser.address || "",
              district: editingUser.district || "",
              idCardType: editingUser.idCardType || "",
            };
            await updateUserToApi(editingUser.id, userData);
            setShowModal(false); // Đóng modal ngay sau khi cập nhật thành công
            form.resetFields(); // Reset form để tránh giữ lại dữ liệu cũ
            message.success("Cập nhật thành công!");
            setUsers((prev) =>
              prev.map((u) =>
                u.id === editingUser.id
                  ? {
                      ...u,
                      ...values,
                      name: values.name, // hoặc fullName nếu backend trả về
                      email: values.email,
                      phone: values.phone,
                      roleID: Number(values.roleID),
                      status: values.status,
                      bloodType: values.bloodType || u.bloodType,
                      department: values.department || u.department,
                    }
                  : u
              )
            );
            setShowModal(false);
          } catch {
            message.error("Lỗi khi cập nhật người dùng!");
          } finally {
            setLoading(false);
          }
        } else {
          try {
            setLoading(true);
            // Build userData đúng định dạng API
            const userData = {
              name: values.name,
              email: values.email,
              phone: values.phone,
              roleID: Number(values.roleID),
              status: values.status === "active" ? 1 : 0,
              bloodGroup: values.bloodType || "",
              department: values.department || "",
              password: "Ab1234@",
              // Các trường bắt buộc bổ sung
              city: "",
              ward: "",
              gender: "Male",
              idCard: "",
              rhType: "Rh+",
              address: "",
              district: "",
              idCardType: "",
            };
            await postUserToApi(userData);
            message.success("Thêm mới thành công!");
            // Reload lại danh sách từ API
            const data = await fetchUsersFromApi();
            const mapped = (Array.isArray(data) ? data : []).map((u) => {
              const roleObj = ROLE_MAP[u.roleID] || ROLE_MAP[1];
              let role = roleObj.value;
              let roleLabel = roleObj.label;
              if (role === "doctor") {
                if (
                  u.department &&
                  u.department.toLowerCase().includes("máu")
                ) {
                  role = "doctor_blood";
                  roleLabel = "Bác sĩ - Khoa máu";
                } else if (u.department) {
                  role = `doctor_other_${u.department}`;
                  roleLabel = `Bác sĩ - ${u.department}`;
                } else {
                  role = "doctor_other";
                  roleLabel = "Bác sĩ";
                }
              }
              return {
                id: u.userID, // luôn lấy userID từ backend
                userID: u.userID, // có thể dùng cho cột riêng nếu cần
                name: u.fullName || u.name || "",
                email: u.email || "",
                phone: u.phoneNumber || u.phone || "",
                role,
                roleLabel,
                status: u.status === 1 ? "active" : "inactive",
                bloodType: u.bloodGroup || u.bloodType || "",
                department: u.department || "",
                createdAt: u.createdAt || "",
              };
            });
            setUsers(mapped);
            setShowModal(false);
          } catch {
            message.error("Lỗi khi thêm người dùng!");
          } finally {
            setLoading(false);
          }
        }
      })
      .catch(() => {});
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý người dùng"
        icon={<TeamOutlined />}
        subtitle="Thêm, chỉnh sửa, tìm kiếm và phân quyền người dùng trong hệ thống"
      />
      <Card
        style={{
          width: "100",
          maxWidth: 1200,
          margin: "0 auto",
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Row
          gutter={16}
          style={{ marginBottom: 16 }}
          align="middle"
          justify="space-between"
        >
          <Col xs={24} sm={12} md={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="member">Thành viên</Option>
              <Option value="doctor_blood">Bác sĩ - Khoa máu</Option>
              <Option value="doctor_other">Bác sĩ - Khoa khác</Option>
              <Option value="manager">Quản lý</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateUser}
              style={{ minWidth: 140 }}
            >
              Thêm người dùng
            </Button>
          </Col>
        </Row>
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            bordered
            size="middle"
            style={{ background: "#fff" }}
          />
        </Spin>
      </Card>
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        open={showModal}
        onOk={handleModalOk}
        onCancel={() => setShowModal(false)}
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
              role: "member",
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
            <Select>
              <Option value={1}>Thành viên</Option>
              <Option value={2}>Bác sĩ</Option>
              <Option value={3}>Quản lý</Option>
              <Option value={4}>Quản trị viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select>
              {STATUS_OPTIONS.map((s) => (
                <Option key={s.value} value={s.value}>
                  {s.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bloodType" label="Nhóm máu">
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Khoa (nếu là bác sĩ)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={deleteModalVisible}
        title="Xác nhận xoá người dùng"
        onOk={handleDeleteUser}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteUserId(null);
        }}
        okText="Xoá"
        okButtonProps={{ danger: true }}
        cancelText="Huỷ"
      >
        <p>Bạn có chắc chắn muốn xoá người dùng này không?</p>
      </Modal>
    </AdminLayout>
  );
};

export default UserManagement;
