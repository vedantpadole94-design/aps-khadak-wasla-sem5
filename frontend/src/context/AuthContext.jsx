import React, { useState } from 'react';
import { api } from '../utils/api';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('aps_admin');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    try {
      const { data, token } = await api.login(credentials);
      const adminData = { ...data, token };
      setAdmin(adminData);
      localStorage.setItem('aps_admin', JSON.stringify(adminData));
      localStorage.setItem('aps_token', token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('aps_admin');
    localStorage.removeItem('aps_token');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
