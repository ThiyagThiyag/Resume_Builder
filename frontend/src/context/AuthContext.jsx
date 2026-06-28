import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', or 'otp'
  const [redirectPath, setRedirectPath] = useState(null);

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  useEffect(() => {
    let logoutTimer;
    if (user && user.token) {
      try {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration <= 0) {
          logout();
        } else {
          logoutTimer = setTimeout(() => {
            logout();
          }, timeUntilExpiration);
        }
      } catch (error) {
        console.error("Invalid token format", error);
        logout();
      }
    }
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { email, password });
      const data = response.data;

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, { name, email, password });
      const data = response.data;

      return data; // Returns requiresVerification: true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const verifyOtp = async (name, email, password, otp) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, { name, email, password, otp });
      const data = response.data;

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP Verification failed');
    }
  };



  const openAuthModal = (mode = 'login', path = null) => {
    setAuthMode(mode);
    setRedirectPath(path);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout, isAuthModalOpen, openAuthModal, closeAuthModal, authMode, setAuthMode, redirectPath, setRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};
