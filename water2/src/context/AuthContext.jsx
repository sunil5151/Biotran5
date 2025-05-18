import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token and fetch user data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear invalid token
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData, token) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('jwtToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};