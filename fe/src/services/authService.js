import { authenticateUser, getUserById, ROLES } from './mockData';
import config from '../config/environment';
import axios from 'axios';

// Authentication service for managing user sessions
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.loadUserFromStorage();
    this.setupAxiosInterceptors();
  }

  // Setup axios interceptors to automatically add auth token
  setupAxiosInterceptors() {
    // Request interceptor to add token
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/logout')) {
          // Token expired or invalid, logout user (but not if it's the logout call itself)
          console.log('401 error detected, logging out user');
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Load user from localStorage on app start
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout();
    }
  }

  // Save user to localStorage
  saveUserToStorage(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      // Real API call to backend
      const response = await axios.post(
        'https://localhost:7021/api/auth/login',
        {
          email: email,
          password: password
        }
      );

      console.log('Login response:', response);

      // Check if login was successful
      if (response.status === 200 && response.data) {
        const userData = response.data;

        // Extract user information from response
        const user = {
          id: userData.id || userData.userId,
          email: userData.email,
          name: userData.name || userData.fullName,
          role: userData.role,
          status: userData.status || 1,
          profile: userData.profile || {
            email: userData.email,
            fullName: userData.name || userData.fullName,
            phone: userData.phone || '',
            address: userData.address || '',
            bloodType: userData.bloodType || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || ''
          },
          isFirstLogin: userData.isFirstLogin || false
        };

        // Save authentication data
        this.currentUser = user;
        this.isAuthenticated = true;

        // Save token if provided
        if (userData.token) {
          localStorage.setItem('authToken', userData.token);
        }

        // Save user to localStorage
        this.saveUserToStorage(user);

        return {
          success: true,
          user: user,
          token: userData.token
        };
      } else {
        return {
          success: false,
          error: response.data?.message || 'Đăng nhập không thành công'
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message ||
                           error.response.data?.error ||
                           'Thông tin đăng nhập không chính xác';
        return { success: false, error: errorMessage };
      } else if (error.request) {
        // Network error
        return { success: false, error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau' };
      } else {
        // Other error
        return { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau' };
      }
    }
  }

  // Register new user
  async register(userData) {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${config.api.baseUrl}/auth/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' };
      // } else {
      //   return { success: false, error: data.message };
      // }

      // MOCK_DATA: Remove this section when implementing real API
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' };
    } catch (error) {
      console.error('Register error:', error);

      // Handle different types of errors
      if (error.response) {
        const errorMessage = error.response.data?.message ||
                           error.response.data?.error ||
                           'Đăng ký không thành công';
        return { success: false, error: errorMessage };
      } else if (error.request) {
        return { success: false, error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau' };
      } else {
        return { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau' };
      }
    }
  }

  // Logout
  async logout() {
    try {
      // Call API to invalidate token if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await axios.post(
            'https://localhost:7021/api/auth/logout',
            {},
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log('Logout API call successful');
        } catch (apiError) {
          console.warn('Logout API call failed, but continuing with local logout:', apiError.message);
          // Don't throw error, just log it and continue with local logout
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local data
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      console.log('Local logout completed');
    }

    return { success: true };
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get user role
  getUserRole() {
    return this.currentUser?.role || ROLES.GUEST;
  }

  // Update user profile
  updateProfile(profileData) {
    if (this.currentUser) {
      this.currentUser.profile = { ...this.currentUser.profile, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }



  // Get user status
  getUserStatus() {
    return this.currentUser?.status || null;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    return roles.includes(this.getUserRole());
  }

  // Get redirect path based on user role and status
  getRedirectPath() {
    if (!this.isAuthenticated) {
      return '/';
    }

    // Check if it's first login for member
    if (this.currentUser?.role === ROLES.MEMBER && this.currentUser?.isFirstLogin) {
      return '/member/profile';
    }

    const role = this.getUserRole();

    switch (role) {
      case ROLES.MEMBER:
        return '/member';

      case ROLES.STAFF_DOCTOR:
        return '/doctor';

      case ROLES.STAFF_BLOOD_MANAGER:
        return '/manager';

      case ROLES.ADMIN:
        return '/admin/dashboard';

      default:
        return '/';
    }
  }

  // Update user profile
  updateProfile(profileData) {
    if (this.currentUser) {
      this.currentUser.profile = { ...this.currentUser.profile, ...profileData };
      this.saveUserToStorage(this.currentUser);
      return true;
    }
    return false;
  }

  // Update user status
  updateStatus(newStatus) {
    if (this.currentUser) {
      this.currentUser.status = newStatus;
      this.saveUserToStorage(this.currentUser);
      return true;
    }
    return false;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

// Export for use in components
export { authService };

// Helper functions for route protection
export const requireAuth = () => {
  return authService.isUserAuthenticated();
};

export const requireRole = (allowedRoles) => {
  if (!authService.isUserAuthenticated()) {
    return false;
  }
  return allowedRoles.includes(authService.getUserRole());
};

// Removed requireMemberType - no longer needed
