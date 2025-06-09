import MOCK_USERS from './mockData';
import config from '../config/environment';

/**
 * Admin Service - Handles all admin-related API calls
 *
 * API Endpoints:
 * - GET /api/admin/dashboard/stats - Dashboard statistics
 * - GET /api/admin/dashboard/activities - Recent activities
 * - GET /api/admin/dashboard/alerts - System alerts
 * - GET /api/admin/users - User management
 * - POST /api/admin/users - Create user
 * - PUT /api/admin/users/{id} - Update user
 * - DELETE /api/admin/users/{id} - Delete user
 * - PUT /api/admin/users/{id}/status - Change user status
 * - GET /api/admin/reports - Generate reports
 * - GET /api/admin/system/settings - System settings
 * - PUT /api/admin/system/settings - Update settings
 */

class AdminService {
  constructor() {
    this.baseURL = config.api.baseUrl;
    this.users = [...MOCK_USERS]; // Mock data for testing
  }

  // ===== DASHBOARD METHODS =====

  /**
   * Get dashboard statistics
   * API: GET /api/admin/dashboard/stats
   */
  async getDashboardStats() {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/admin/dashboard/stats`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return { success: true, data: data.stats, message: 'Dashboard stats retrieved successfully' };
      // } else {
      //   return { success: false, error: data.message, message: 'Failed to retrieve dashboard stats' };
      // }

      // MOCK_DATA: Remove this section when implementing real API
      await this.simulateDelay();
      const stats = {
        totalUsers: this.users.length,
        totalBlogs: 89, // From blog service
        pendingBlogs: 12,
        totalRequests: 456,
        activeUsers: this.users.filter(user => user.status === 'ACTIVE').length,
        systemHealth: 'good'
      };

      return {
        success: true,
        data: stats,
        message: 'Dashboard stats retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve dashboard stats'
      };
    }
  }

  /**
   * Get recent activities
   * API: GET /api/admin/dashboard/activities?limit={limit}
   */
  async getRecentActivities(limit = 10) {
    try {
      await this.simulateDelay();
      
      const activities = [
        {
          id: 1,
          type: 'user_registration',
          message: 'Người dùng mới đăng ký: Nguyễn Văn A',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          icon: 'fas fa-user-plus',
          color: 'success'
        },
        {
          id: 2,
          type: 'blog_submission',
          message: 'Bài viết mới cần duyệt: "Kinh nghiệm hiến máu"',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          icon: 'fas fa-blog',
          color: 'warning'
        },
        {
          id: 3,
          type: 'blood_request',
          message: 'Yêu cầu máu khẩn cấp: Nhóm máu O-',
          timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
          icon: 'fas fa-tint',
          color: 'danger'
        },
        {
          id: 4,
          type: 'system_backup',
          message: 'Sao lưu hệ thống hoàn tất',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          icon: 'fas fa-database',
          color: 'info'
        }
      ];

      return {
        success: true,
        data: activities.slice(0, limit),
        message: 'Recent activities retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve recent activities'
      };
    }
  }

  /**
   * Get system alerts
   * API: GET /api/admin/dashboard/alerts
   */
  async getSystemAlerts() {
    try {
      await this.simulateDelay();
      
      const alerts = [
        {
          id: 1,
          type: 'warning',
          title: 'Dung lượng lưu trữ',
          message: 'Dung lượng đĩa đạt 85%. Cần dọn dẹp hoặc mở rộng.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'info',
          title: 'Cập nhật hệ thống',
          message: 'Phiên bản mới v2.1.0 đã sẵn sàng để cập nhật.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        success: true,
        data: alerts,
        message: 'System alerts retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve system alerts'
      };
    }
  }

  // ===== USER MANAGEMENT METHODS =====

  /**
   * Get all users with pagination and filters
   * API: GET /api/admin/users?page={page}&limit={limit}&search={search}&role={role}&status={status}
   */
  async getUsers(filters = {}) {
    try {
      await this.simulateDelay();
      
      let filteredUsers = [...this.users];

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phone.includes(searchTerm)
        );
      }

      // Apply role filter
      if (filters.role && filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredUsers.length / limit),
          totalItems: filteredUsers.length,
          itemsPerPage: limit
        },
        message: 'Users retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve users'
      };
    }
  }

  /**
   * Create new user
   * API: POST /api/admin/users
   */
  async createUser(userData) {
    try {
      await this.simulateDelay();
      
      const newUser = {
        userID: Math.max(...this.users.map(u => u.userID)) + 1,
        ...userData,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: userData.name,
          phone: userData.phone,
          email: userData.email,
          ...userData.profile
        }
      };

      this.users.push(newUser);

      return {
        success: true,
        data: newUser,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create user'
      };
    }
  }

  /**
   * Update user
   * API: PUT /api/admin/users/{id}
   */
  async updateUser(userId, userData) {
    try {
      await this.simulateDelay();
      
      const userIndex = this.users.findIndex(user => user.userID === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      this.users[userIndex] = {
        ...this.users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: this.users[userIndex],
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user'
      };
    }
  }

  /**
   * Delete user
   * API: DELETE /api/admin/users/{id}
   */
  async deleteUser(userId) {
    try {
      await this.simulateDelay();
      
      const userIndex = this.users.findIndex(user => user.userID === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      this.users.splice(userIndex, 1);

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete user'
      };
    }
  }

  /**
   * Change user status
   * API: PUT /api/admin/users/{id}/status
   */
  async changeUserStatus(userId, newStatus) {
    try {
      await this.simulateDelay();
      
      const userIndex = this.users.findIndex(user => user.userID === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      this.users[userIndex] = {
        ...this.users[userIndex],
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: this.users[userIndex],
        message: 'User status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user status'
      };
    }
  }

  // ===== REPORTS METHODS =====

  /**
   * Generate reports
   * API: GET /api/admin/reports?type={type}&period={period}&format={format}
   */
  async generateReports(type, period = 'month', format = 'json') {
    try {
      await this.simulateDelay(1500); // Longer delay for report generation
      
      const reportData = {
        overview: {
          totalUsers: this.users.length,
          totalBlogs: 89,
          totalRequests: 456,
          totalDonations: 234,
          activeUsers: this.users.filter(u => u.status === 'ACTIVE').length,
          pendingApprovals: 12
        },
        userStats: {
          newRegistrations: this.generateMockChartData(),
          usersByRole: this.getUsersByRole(),
          activeUsers: this.users.filter(u => u.status === 'ACTIVE').length,
          inactiveUsers: this.users.filter(u => u.status !== 'ACTIVE').length
        },
        period,
        generatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: reportData,
        message: 'Report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate report'
      };
    }
  }

  // ===== UTILITY METHODS =====

  getUsersByRole() {
    const roleCount = {};
    this.users.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    return Object.entries(roleCount).map(([role, count]) => ({
      role: this.formatRoleName(role),
      count,
      percentage: ((count / this.users.length) * 100).toFixed(1)
    }));
  }

  formatRoleName(role) {
    const roleNames = {
      'GUEST': 'Guest',
      'MEMBER': 'Member',
      'STAFF_DOCTOR_BLOOD': 'Doctor (Blood)',
      'STAFF_DOCTOR_OTHER': 'Doctor (Other)',
      'STAFF_BLOOD_MANAGER': 'Manager',
      'ADMIN': 'Admin'
    };
    return roleNames[role] || role;
  }

  generateMockChartData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      count: Math.floor(Math.random() * 50) + 20
    }));
  }

  async simulateDelay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;
