import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from "framer-motion";
import { KeyRound, Lock, CheckCircle2 } from 'lucide-react';

export const ChangePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword(password);
      const role = user?.role || 'member';
      navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    } catch (err) {
      setError('Failed to update password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-bg relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-portal-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-portal-card border border-portal-border rounded-[32px] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-portal-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-portal-accent" />
          </div>
          <h1 className="text-2xl font-bold text-portal-text">Set New Password</h1>
          <p className="text-portal-text-muted mt-2">Please create a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-portal-text ml-2">New Password</label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-portal-text ml-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-portal-input border border-portal-border rounded-xl py-4 pl-12 pr-4 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
              />
            </div>
          </div>

          <div className="bg-portal-input rounded-xl p-4 space-y-2 border border-portal-border">
            <p className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest mb-1">Requirements</p>
            <div className="flex items-center gap-2 text-xs text-portal-text-muted">
              <CheckCircle2 className={`w-3 h-3 ${password.length >= 8 ? 'text-portal-accent' : 'text-white/20'}`} />
              At least 8 characters
            </div>
            <div className="flex items-center gap-2 text-xs text-portal-text-muted">
              <CheckCircle2 className={`w-3 h-3 ${password === confirmPassword && password !== '' ? 'text-portal-accent' : 'text-white/20'}`} />
              Passwords match
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-portal-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98] mt-2"
          >
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};
