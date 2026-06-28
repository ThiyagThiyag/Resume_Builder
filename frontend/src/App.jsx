import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TemplatesPage from './pages/TemplatesPage';
import FeaturesPage from './pages/FeaturesPage';
import DevelopersPage from './pages/DevelopersPage';
import BuilderPage from './pages/BuilderPage';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/CustomCursor';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={
          <ProtectedRoute>
            <BuilderPage />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-100/50">
        <BrowserRouter>
          <Navbar />
          <AuthModal />
          <CustomCursor />
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
