import { authenticateUser, getUserById, ROLES } from './mockData';

// Authentication service for managing user sessions
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.loadUserFromStorage();
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = authenticateUser(email, password);
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        this.saveUserToStorage(user);
        return { success: true, user };
      } else {
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
      }
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập' };
    }
  }

  // Logout
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('currentUser');
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

  // Logout method
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    return { success: true };
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
        return '/admin';

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
