import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckCircle2, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;
  const { user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    if (currentPath === '/builder') {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }
  }, [currentPath]);

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', path);
    }
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div 
            className={`fixed left-0 right-0 z-50 flex justify-center px-4 ${currentPath === '/builder' ? 'top-0 pt-6 pb-6' : 'top-6'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            onMouseLeave={() => {
              if (currentPath === '/builder') setIsNavbarVisible(false);
            }}
          >
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl shadow-indigo-500/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl relative">
              <Link to="/" className="text-xl font-bold text-gradient hover:scale-105 transition-transform">
          Resumify
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/features" 
            className={`font-semibold transition-colors ${currentPath === '/features' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}
          >
            Features
          </Link>
          <Link 
            to="/templates"
            className={`font-semibold transition-colors ${currentPath === '/templates' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}
          >
            Templates
          </Link>
          <Link 
            to="/builder"
            onClick={(e) => handleProtectedClick(e, '/builder')}
            className={`font-semibold transition-colors ${currentPath === '/builder' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}
          >
            Builder
          </Link>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              <User size={16} className="text-brand" />
              {user.email.split('@')[0]}
            </span>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-slate-100 text-slate-700 p-2 sm:px-4 sm:py-2 rounded-full font-bold text-sm shadow-sm hover:bg-slate-200 transition-all duration-300 flex items-center gap-2"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openAuthModal('login')}
              className="text-slate-600 hover:text-brand font-semibold px-4 py-2 transition-colors hidden sm:block"
            >
              Log In
            </button>
            <button 
              onClick={() => openAuthModal('signup')}
              className="bg-brand text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-brand/30 hover:scale-105 hover:shadow-brand/50 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu Button on Builder Page */}
      {currentPath === '/builder' && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-56 flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <div className="font-bold text-brand flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold">R</div>
                    <span className="text-lg">Resumify</span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link to="/" onClick={() => setIsDropdownOpen(false)} className="px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand rounded-lg transition-colors">Home</Link>
                  <Link to="/features" onClick={() => setIsDropdownOpen(false)} className="px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand rounded-lg transition-colors">Features</Link>
                  <Link to="/templates" onClick={() => setIsDropdownOpen(false)} className="px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand rounded-lg transition-colors">Templates</Link>
                </div>
                
                <div className="p-2 border-t border-slate-100 mt-1">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-xs font-medium text-slate-400 truncate mb-1 bg-slate-50 rounded-lg">
                        {user.email}
                      </div>
                      <button 
                        onClick={() => { setIsDropdownOpen(false); setShowLogoutConfirm(true); }}
                        className="w-full text-left px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { setIsDropdownOpen(false); openAuthModal('login'); }}
                      className="w-full text-center px-3 py-2 text-sm font-bold text-brand bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Log In / Sign Up
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-14 h-14 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 hover:bg-slate-900 transition-all border border-slate-700"
            title="Navigation Menu"
          >
            {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-slate-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Sign Out</h3>
              <p className="text-slate-600 text-center mb-6">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800"
            >
              <CheckCircle2 size={24} className="text-green-400" />
              <span className="font-bold text-lg">Successfully signed out!</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
