import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from "framer-motion";
import { IdCard, Lock, LogIn, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      navigate(role === 'admin' || role === 'super_admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

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

      const role = result.user.role;
      navigate(role === 'admin' || role === 'super_admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    } catch (err) {
      setError('Invalid email, ID, or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-portal-bg relative overflow-hidden p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-portal-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-portal-text tracking-tight">CSEC ASTU Portal</h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-md w-full bg-portal-card border border-portal-border rounded-[32px] p-10 shadow-2xl relative z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-portal-text ml-2">Email or ID Number</label>
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="student@astu.edu.et or UGR/12345/15"
                className="w-full bg-portal-input border border-portal-border rounded-xl py-4 pl-12 pr-4 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-portal-text ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-portal-input border border-portal-border rounded-xl py-4 pl-12 pr-4 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-portal-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98] mt-2"
          >
            Access Portal
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/forgot-password" size="sm" className="text-sm font-medium text-portal-text-muted hover:text-portal-text transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Quick Access for Demo */}
        <div className="mt-10 pt-8 border-t border-portal-border/50">
          <p className="text-[10px] font-bold text-portal-text-muted uppercase tracking-[0.2em] mb-2 text-center">Demo Access</p>
          <p className="text-[11px] text-portal-text-muted text-center">Password: DemoPass123</p>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Admin', email: 'admin.demo@astu.edu.et', campusId: 'UGR/90001/26' },
                { id: 'Instructor', email: 'instructor.demo@astu.edu.et', campusId: 'UGR/90002/26' },
                { id: 'Student', email: 'member.demo@astu.edu.et', campusId: 'UGR/90003/26' }
              ].map(role => (
                <button 
                  key={role.id}
                  onClick={() => { setIdentifier(role.email); setPassword('DemoPass123'); }}
                  className="py-2.5 px-1 bg-portal-input border border-portal-border rounded-xl text-[10px] font-bold text-portal-text-muted hover:text-portal-text hover:border-portal-accent transition-all"
                >
                  {role.id} Email
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Admin', campusId: 'UGR/90001/26' },
                { id: 'Instructor', campusId: 'UGR/90002/26' },
                { id: 'Student', campusId: 'UGR/90003/26' }
              ].map(role => (
                <button 
                  key={role.id}
                  onClick={() => { setIdentifier(role.campusId); setPassword('DemoPass123'); }}
                  className="py-2.5 px-1 bg-portal-input border border-portal-border rounded-xl text-[10px] font-bold text-portal-text-muted hover:text-portal-text hover:border-portal-accent transition-all"
                >
                  {role.id} ID
                </button>
              ))}
            </div>
          </div>
        </div>

      </motion.div>

      {/* Sun/Light Toggle Icon at bottom like in image */}
      <button 
        onClick={toggleTheme}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 transition-all focus:outline-none"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
};
