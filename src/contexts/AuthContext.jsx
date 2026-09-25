import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        // If no user is logged in, default to student Pugazh Rajan for seamless initial exploration
        if (!currentUser) {
          const defaultStudent = await authService.quickLoginAs('pugazh');
          setUser(defaultStudent.user);
        } else {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.adminLogin(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.register(formData);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchDemoUser = async (userType) => {
    setLoading(true);
    try {
      const res = await authService.quickLoginAs(userType);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, profileData);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    logout,
    switchDemoUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
