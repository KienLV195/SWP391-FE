import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize auth state from storage
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isUserAuthenticated();
        
        setUser(currentUser);
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Có lỗi xảy ra khi đăng xuất' };
    }
  };

  const updateProfile = (profileData) => {
    try {
      const success = authService.updateProfile(profileData);
      if (success) {
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const updateStatus = (newStatus) => {
    try {
      const success = authService.updateStatus(newStatus);
      if (success) {
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Update status error:', error);
      return false;
    }
  };

  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles) => {
    return authService.hasAnyRole(roles);
  };

  const getRedirectPath = () => {
    return authService.getRedirectPath();
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Methods
    login,
    logout,
    updateProfile,
    updateStatus,
    hasRole,
    hasAnyRole,
    getRedirectPath,
    
    // Computed values
    userRole: user?.role || null,
    userStatus: user?.status || null,
    isFirstLogin: user?.isFirstLogin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
