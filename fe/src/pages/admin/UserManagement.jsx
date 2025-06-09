import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/pages/UserManagement.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // API Calls for User Management:
  // GET /api/admin/users?page={page}&limit={limit}&search={search}&role={role}&status={status}
  // POST /api/admin/users - Create new user
  // PUT /api/admin/users/{id} - Update user
  // DELETE /api/admin/users/{id} - Delete user
  // PUT /api/admin/users/{id}/status - Change user status
  // Headers: Authorization: Bearer {admin_token}
  // Response: { success: boolean, data: Object|Array, message: string, pagination?: Object }

  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0123456789",
        role: "member",
        status: "active",
        bloodType: "O+",
        createdAt: "2024-01-10",
        lastLogin: "2024-01-15 14:30:00",
      },
      {
        id: 2,
        name: "BS. Trần Thị B",
        email: "bsthib@hospital.com",
        phone: "0987654321",
        role: "doctor",
        status: "active",
        department: "Khoa máu",
        createdAt: "2023-12-15",
        lastLogin: "2024-01-15 09:15:00",
      },
      {
        id: 3,
        name: "Lê Văn C",
        email: "levanc@email.com",
        phone: "0369852147",
        role: "member",
        status: "inactive",
        bloodType: "A+",
        createdAt: "2024-01-05",
        lastLogin: "2024-01-10 16:45:00",
      },
      {
        id: 4,
        name: "QL. Phạm Thị D",
        email: "qlthid@hospital.com",
        phone: "0147258369",
        role: "manager",
        status: "active",
        department: "Quản lý máu",
        createdAt: "2023-11-20",
        lastLogin: "2024-01-15 11:20:00",
      },
      {
        id: 5,
        name: "Hoàng Văn E",
        email: "hoangvane@email.com",
        phone: "0258147369",
        role: "member",
        status: "suspended",
        bloodType: "B-",
        createdAt: "2023-12-28",
        lastLogin: "2024-01-08 13:10:00",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: "Quản trị viên", class: "role-admin" },
      manager: { label: "Quản lý", class: "role-manager" },
      doctor: { label: "Bác sĩ", class: "role-doctor" },
      member: { label: "Thành viên", class: "role-member" },
    };

    const config = roleConfig[role] || roleConfig.member;
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Hoạt động", class: "status-active" },
      inactive: { label: "Không hoạt động", class: "status-inactive" },
      suspended: { label: "Tạm khóa", class: "status-suspended" },
      banned: { label: "Cấm", class: "status-banned" },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
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
        <div className="user-management">
          <div className="page-header">
            <div className="header-content">
              <h1>Quản lý người dùng</h1>
              <p>Quản lý tài khoản và phân quyền người dùng</p>
            </div>
            <button className="btn-primary" onClick={handleCreateUser}>
              <i className="fas fa-plus"></i>
              Thêm người dùng
            </button>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="doctor">Bác sĩ</option>
                <option value="member">Thành viên</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Tạm khóa</option>
                <option value="banned">Cấm</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thông tin bổ sung</th>
                  <th>Đăng nhập cuối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                          <div className="user-phone">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      {user.bloodType && (
                        <span className="blood-type">
                          Nhóm máu: {user.bloodType}
                        </span>
                      )}
                      {user.department && (
                        <span className="department">{user.department}</span>
                      )}
                    </td>
                    <td>
                      <span className="last-login">
                        {new Date(user.lastLogin).toLocaleString("vi-VN")}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditUser(user)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <div className="status-dropdown">
                          <button
                            className="action-btn status"
                            title="Thay đổi trạng thái"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <div className="dropdown-menu">
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                            >
                              Kích hoạt
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                            >
                              Tạm khóa
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "banned")
                              }
                            >
                              Cấm
                            </button>
                          </div>
                        </div>

                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="pagination-info">
                Trang {currentPage} / {totalPages}
              </div>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
