import { ROLES } from "./mockData";
import axios from "axios";

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
        const token = localStorage.getItem("authToken");
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
        if (
          error.response?.status === 401 &&
          !error.config.url.includes("/auth/logout")
        ) {
          // Token expired or invalid, logout user (but not if it's the logout call itself)
          console.log("401 error detected, logging out user");
          this.logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Load user from localStorage on app start
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      this.logout();
    }
  }

  // Save user to localStorage
  saveUserToStorage(user) {
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const response = await axios.post(
        "https://blooddonationswp391-h6b6cvehfca8dpey.canadacentral-01.azurewebsites.net/api/Auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        const token = response.data;
        console.log("Login response (token):", token); // Debug log

        if (!token) {
          console.error("No token received");
          return {
            success: false,
            error: "Không nhận được token xác thực",
          };
        }

        // Decode JWT token
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          console.error("Invalid token format");
          return {
            success: false,
            error: "Token không hợp lệ",
          };
        }

        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Decoded token payload:", payload); // Debug log

          // Map role string/number from token to standardized role code
          function mapRole(rawRole) {
            if (rawRole === "Admin" || rawRole === 4 || rawRole === "4")
              return ROLES.ADMIN;
            if (rawRole === "Member" || rawRole === 1 || rawRole === "1")
              return ROLES.MEMBER;
            if (rawRole === "Staff_Doctor" || rawRole === 2 || rawRole === "2")
              return ROLES.STAFF_DOCTOR;
            if (rawRole === "Staff_Blood_Manager" || rawRole === 3 || rawRole === "3")
              return ROLES.STAFF_BLOOD_MANAGER;
            return ROLES.GUEST;
          }

          // Extract user information from token payload
          const user = {
            id: payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
            email:
              payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            name:
              payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ] ||
              payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ].split("@")[0],
            role: mapRole(
              payload[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ]
            ),
            status: 1,
            profile: {
              email:
                payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ],
              fullName:
                payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ] ||
                payload[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ].split("@")[0],
              phone: "",
              address: "",
              bloodType: "",
              dateOfBirth: "",
              gender: "",
              department: "",
            },
            isFirstLogin: true,
          };

          console.log("Mapped user object:", user); // Debug log

          // Save authentication data
          this.currentUser = user;
          this.isAuthenticated = true;

          // Save token
          localStorage.setItem("authToken", token);

          // Save user to localStorage
          this.saveUserToStorage(user);

          return {
            success: true,
            user: user,
            token: token,
          };
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          return {
            success: false,
            error: "Không thể xác thực token",
          };
        }
      } else {
        return {
          success: false,
          error: response.data?.message || "Đăng nhập không thành công",
        };
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let errorMessage;
        const status = error.response.status;
        if (status === 500) {
          errorMessage = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
        } else if (status === 401) {
          errorMessage = "Email hoặc mật khẩu không đúng.";
        } else if (status === 403) {
          errorMessage = "Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.";
        } else {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Thông tin đăng nhập không chính xác";
        }
        return { success: false, error: errorMessage };
      } else if (error.request) {
        // The request was made but no response was received
        return {
          success: false,
          error: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        return {
          success: false,
          error: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
        };
      }
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await axios.post(
        "https://blooddonationswp391-h6b6cvehfca8dpey.canadacentral-01.azurewebsites.net/api/Auth/Register",
        {
          ...userData,
          roleId: 2, // Set roleId to 2 for Member role
          status: 1, // Active status
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Đăng ký không thành công",
        };
      }
    } catch (error) {
      console.error("Register error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Đăng ký không thành công";
        return { success: false, error: errorMessage };
      } else if (error.request) {
        return {
          success: false,
          error: "Không thể kết nối đến hệ thống. Vui lòng thử lại sau",
        };
      } else {
        return {
          success: false,
          error: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau",
        };
      }
    }
  }

  // Logout
  async logout() {
    try {
      // Call API to invalidate token if token exists
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await axios.post(
            "/api/Auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Logout API call successful");
        } catch (apiError) {
          console.warn(
            "Logout API call failed, but continuing with local logout:",
            apiError.message
          );
          // Don't throw error, just log it and continue with local logout
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local data
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      console.log("Local logout completed");
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
  async updateUserProfile(profileData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return {
          success: false,
          error: "Không tìm thấy token xác thực",
        };
      }

      const response = await axios.put("/api/users/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Update local user data
        const updatedUser = { ...this.currentUser, ...profileData };
        this.currentUser = updatedUser;
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        return {
          success: true,
          data: updatedUser,
          message: "Cập nhật thông tin thành công",
        };
      } else {
        return {
          success: false,
          error:
            response.data?.message || "Cập nhật thông tin không thành công",
        };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Cập nhật thông tin không thành công",
      };
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
      return "/";
    }

    // Check if it's first login for member
    if (
      this.currentUser?.role === ROLES.MEMBER &&
      this.currentUser?.isFirstLogin
    ) {
      return "/member/profile";
    }

    const role = this.getUserRole();

    switch (role) {
      case ROLES.MEMBER:
        return "/member";

      case ROLES.STAFF_DOCTOR:
        return "/doctor";

      case ROLES.STAFF_BLOOD_MANAGER:
        return "/manager";

      case ROLES.ADMIN:
        return "/admin/dashboard";

      default:
        return "/";
    }
  }

  // Update user profile
  updateProfile(profileData) {
    if (this.currentUser) {
      this.currentUser.profile = {
        ...this.currentUser.profile,
        ...profileData,
      };
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    }
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
