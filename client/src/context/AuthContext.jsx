import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aetheria_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('aetheria_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on start
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('aetheria_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('aetheria_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or server unavailable, maintaining local user if demo.');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('aetheria_token', res.token);
        localStorage.setItem('aetheria_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: 'Invalid response' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('aetheria_token', res.token);
        localStorage.setItem('aetheria_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async (role = 'admin') => {
    const credentials = role === 'admin' 
      ? { email: 'admin@library.com', password: 'admin123' }
      : { email: 'student@library.com', password: 'student123' };

    return await login(credentials.email, credentials.password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aetheria_token');
    localStorage.removeItem('aetheria_user');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('aetheria_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: 'Failed to update profile' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    demoLogin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
