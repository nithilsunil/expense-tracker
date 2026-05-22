import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authenticate session on boot
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Verify token validity by calling /auth/me
          const response = await api.get('/auth/me');
          const fetchedUser = response.data.data.user;
          
          setUser(fetchedUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(fetchedUser));
        } catch (error) {
          console.error('Session verification failed, logging out:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Invalid email or password.';
      throw new Error(message);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Failed to register account.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
