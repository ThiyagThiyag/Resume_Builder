import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, openAuthModal, isAuthModalOpen } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      openAuthModal('login', location.pathname);
    }
  }, [user, openAuthModal, location.pathname]);

  if (!user) {
    if (isAuthModalOpen) return children; // Show the editor underneath while modal is open to avoid blank screen
    return <Navigate to="/" replace />; // Fallback redirect if modal fails or is closed without logging in
  }

  return children;
}
