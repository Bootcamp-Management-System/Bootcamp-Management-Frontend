import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, IdCard, Lock, ShieldCheck } from 'lucide-react';

const MotionDiv = motion.div;
const MotionP = motion.p;

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname;

  const getHomePath = (role) => (
    role === 'super_admin' ? '/super-admin/dashboard' : role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard'
  );

  const dashboardPath = isAuthenticated && user ? getHomePath(user.role) : '/';

  useEffect(() => {
    if (isAuthenticated && user) {
      const target = fromPath && fromPath !== '/login' ? fromPath : getHomePath(user.role);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, fromPath]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(identifier, password);
      if (result.requiresOtp) {
        navigate('/otp', { state: { email: result.user?.email || identifier } });
        return;
      }
      if (result.requiresApproval) {
        navigate('/waiting-approval', { state: { email: result.user.email } });
        return;
      }
      if (result.requiresPasswordChange) {
        navigate('/force-change-password', { state: { email: result.user.email, purpose: 'force-change-password' } });
        return;
      }
      const target = fromPath && fromPath !== '/login' ? fromPath : getHomePath(result.user.role);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email, ID, or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden p-6 font-outfit">
      <Link
        to={dashboardPath}
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-portal-border/70 bg-portal-card/80 px-4 py-2 text-sm font-medium text-portal-text shadow-sm transition-colors hover:border-portal-accent/50 hover:bg-portal-card hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-portal-accent/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />

      {/* Header Logo Section */}
      <MotionDiv 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center relative z-10 flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-portal-accent/10 rounded-2xl flex items-center justify-center mb-4 border border-portal-accent/20 shadow-lg shadow-portal-accent/5">
          <ShieldCheck className="w-8 h-8 text-portal-accent" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">CSEC ASTU <span className="text-portal-accent">Portal</span></h1>
        <p className="text-portal-text-muted text-sm mt-2 font-medium">Log in to your specialized learning environment</p>
      </MotionDiv>

      {/* Main Login Card */}
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-portal-card/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-portal-accent uppercase tracking-widest ml-1">Email / ID</label>
            <div className="relative group">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Campus ID"
                className="w-full bg-portal-bg/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-portal-accent/50 focus:bg-portal-bg transition-all placeholder:text-portal-text-muted/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-portal-accent uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-portal-bg/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-portal-accent/50 focus:bg-portal-bg transition-all"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-portal-text-muted transition-colors hover:text-portal-accent focus:outline-none focus:ring-2 focus:ring-portal-accent/40"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <MotionP 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs font-medium text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
              >
                {error}
              </MotionP>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            className="group w-full bg-portal-accent text-portal-bg py-4 rounded-2xl font-bold text-sm shadow-xl shadow-portal-accent/10 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/forgot-password" size="sm" className="text-sm font-medium text-portal-text-muted hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>


        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-portal-text-muted">
            New applicant? {' '}
            <Link to="/signup" className="text-portal-accent font-bold hover:underline underline-offset-4 decoration-2">
              Create an Account
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};
