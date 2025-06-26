import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getUsers as fetchUsersFromApi,
  createUser as postUserToApi,
  deleteUser as deleteUserFromApi,
  updateUser as updateUserToApi,
} from "../services/userApi";

const ROLE_MAP = {
  1: { value: "member", label: "Thành viên" },
  2: { value: "doctor", label: "Bác sĩ" },
  3: { value: "manager", label: "Quản lý" },
  4: { value: "admin", label: "Quản trị viên" },
};

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động", apiValue: 1 },
  { value: "inactive", label: "Không hoạt động", apiValue: 0 },
  { value: "banned", label: "Cấm", apiValue: 2 },
];

const DEPARTMENTS = [
  "Khoa Nhi",
  "Khoa Cấp Cứu",
  "Khoa Giải phẫu",
  "Khoa Tim mạch",
  "Khoa Ngoại",
  "Khoa Huyết học",
];

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const mapUserData = (userData) => {
    return (Array.isArray(userData) ? userData : []).map((u) => {
      const roleObj = ROLE_MAP[u.roleID] || ROLE_MAP[1];
      let role = roleObj.value;
      let roleLabel = roleObj.label;
      if (role === "doctor") {
        if (u.department && u.department.trim() === "Khoa Huyết học") {
          role = "doctor_blood";
          roleLabel = "Bác sĩ - Khoa Huyết học";
        } else if (u.department) {
          role = "doctor_other";
          roleLabel = `Bác sĩ - ${u.department}`;
        } else {
          role = "doctor_other";
          roleLabel = "Bác sĩ";
        }
      }
      const statusObj =
        STATUS_OPTIONS.find((s) => s.apiValue === u.status) ||
        STATUS_OPTIONS[1];
      return {
        id: u.userID,
        userID: u.userID,
        name: u.fullName || u.name || "",
        email: u.email || "",
        phone: u.phoneNumber || u.phone || "",
        role,
        roleLabel,
        status: statusObj.value,
        statusLabel: statusObj.label,
        bloodType: u.bloodGroup || u.bloodType || "",
        department: u.department || "",
        createdAt: u.createdAt || "",
      };
    });
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsersFromApi();
      const mapped = mapUserData(data);
      setUsers(mapped);
    } catch {
      message.error("Không thể tải dữ liệu người dùng từ API!");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleteModalVisible(false);
    setDeleteUserId(null);
    try {
      setLoading(true);
      await deleteUserFromApi(deleteUserId);
      await loadUsers();
      message.success("Đã xóa người dùng!");
    } catch {
      message.error("Lỗi khi xóa người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async (form, values) => {
    if (editingUser) {
      try {
        setLoading(true);
        const statusObj =
          STATUS_OPTIONS.find((s) => s.value === values.status) ||
          STATUS_OPTIONS[1];
        const userData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          roleID: Number(values.roleID),
          status: statusObj.apiValue,
          bloodGroup: values.bloodType || editingUser.bloodType || "",
          department: values.department || editingUser.department || "",
          password: editingUser.password || "Ab1234@",
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
        setShowModal(false);
        form.resetFields();
        message.success("Cập nhật thành công!");
        await loadUsers();
      } catch {
        message.error("Lỗi khi cập nhật người dùng!");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const statusObj =
          STATUS_OPTIONS.find((s) => s.value === values.status) ||
          STATUS_OPTIONS[1];
        const userData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          roleID: Number(values.roleID),
          status: statusObj.apiValue,
          bloodGroup: values.bloodType || "",
          department: values.department || "",
          password: "Ab1234@",
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
        await loadUsers();
        setShowModal(false);
      } catch {
        message.error("Lỗi khi thêm người dùng!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteUserId(user.id);
    setDeleteModalVisible(true);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    roleFilter,
    statusFilter,
    showModal,
    editingUser,
    deleteModalVisible,

    // Constants
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
  };
};
