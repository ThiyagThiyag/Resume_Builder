import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup, verifyOtp, authMode, setAuthMode, redirectPath, setRedirectPath } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setOtp('');
      setErrorMsg('');
      setSuccessMsg('');
      setFieldErrors({});
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isLogin = authMode === 'login';
  const isOtp = authMode === 'otp';

  const validateField = (field, value) => {
    let error = '';
    if (field === 'name' && !isLogin && !isOtp) {
      if (!value.trim()) error = 'Name is required';
    } else if (field === 'email' && !isOtp) {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(value)) {
        error = 'Must be a Google, Yahoo, or Outlook domain';
      }
    } else if (field === 'password' && !isOtp) {
      if (!value) {
        error = 'Password is required';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        error = 'Min 8 chars, 1 uppercase, 1 number, 1 symbol';
      }
    } else if (field === 'otp' && isOtp) {
      if (!value) {
        error = 'OTP is required';
      } else if (value.length !== 6) {
        error = 'OTP must be exactly 6 digits';
      }
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'otp') setOtp(value.replace(/\D/g, '').slice(0, 6)); // Only digits, max 6

    // Validate on input
    const error = validateField(field, field === 'otp' ? value.replace(/\D/g, '').slice(0, 6) : value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const finalizeAuth = () => {
    if (redirectPath) {
      navigate(redirectPath);
      setRedirectPath(null);
    }
    setTimeout(() => {
      closeAuthModal();
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    if (isOtp) {
      const otpError = validateField('otp', otp);
      newErrors = { otp: otpError };
      setFieldErrors(newErrors);
      if (otpError) return;
    } else {
      const nameError = validateField('name', name);
      const emailError = validateField('email', email);
      const passwordError = validateField('password', password);
      
      newErrors = {
        name: nameError,
        email: emailError,
        password: passwordError
      };
      setFieldErrors(newErrors);
      
      if (emailError || passwordError || (!isLogin && nameError)) {
        return;
      }
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isOtp) {
        await verifyOtp(name, email, password, otp);
        setSuccessMsg('Email verified and account created successfully!');
        finalizeAuth();
      } else if (isLogin) {
        await login(email, password);
        setSuccessMsg('Successfully logged in!');
        finalizeAuth();
      } else {
        const res = await signup(name, email, password);
        if (res.requiresVerification) {
          setSuccessMsg('OTP sent to your email.');
          setAuthMode('otp');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeAuthModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-10 overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>

            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-20"
            >
              <X size={24} />
            </button>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {isOtp ? 'Verify Email' : isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {isOtp ? 'Enter the 6-digit OTP sent to your email' : isLogin ? 'Sign in to access your templates' : 'Sign up to start building your resume'}
                </p>
              </div>
              
              {/* Inline Messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-lg flex items-center gap-2 border border-red-200"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-green-50 text-green-600 text-sm font-semibold p-3 rounded-lg flex items-center gap-2 border border-green-200"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {isOtp ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">6-Digit OTP</label>
                    <div className="relative">
                      <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.otp ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all bg-slate-50/50 tracking-[0.5em] font-bold text-center ${
                          fieldErrors.otp 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20'
                        }`}
                        placeholder="000000"
                        maxLength="6"
                      />
                    </div>
                    <AnimatePresence>
                      {fieldErrors.otp && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-semibold mt-1.5 ml-1 text-center">
                          {fieldErrors.otp}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.name ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all bg-slate-50/50 ${
                              fieldErrors.name 
                              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20'
                            }`}
                            placeholder="John Doe"
                          />
                        </div>
                        <AnimatePresence>
                          {fieldErrors.name && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
                              {fieldErrors.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all bg-slate-50/50 ${
                            fieldErrors.email 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20'
                          }`}
                          placeholder="you@gmail.com"
                        />
                      </div>
                      <AnimatePresence>
                        {fieldErrors.email && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
                            {fieldErrors.email}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all bg-slate-50/50 ${
                            fieldErrors.password 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      <AnimatePresence>
                        {fieldErrors.password && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
                            {fieldErrors.password}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-brand text-white font-bold py-3 rounded-xl transition-all active:scale-95 mt-4 flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30'}`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    isOtp ? 'Verify OTP' : isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              {!isOtp && (
                <div className="mt-8 text-center text-sm text-slate-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setSuccessMsg('');
                      setFieldErrors({});
                      setAuthMode(isLogin ? 'signup' : 'login');
                    }}
                    className="text-brand font-bold hover:underline transition-all"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
