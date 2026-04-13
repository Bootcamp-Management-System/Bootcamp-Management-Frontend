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
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-sage-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sage-500/20">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-sage-900">Set New Password</h1>
          <p className="text-sage-500 mt-2">Please create a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sage-500 uppercase mb-1.5 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sage-50 border border-sage-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sage-500 uppercase mb-1.5 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sage-50 border border-sage-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
              />
            </div>
          </div>

          <div className="bg-sage-50 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">Requirements</p>
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <CheckCircle2 className={`w-3 h-3 ${password.length >= 8 ? 'text-sage-500' : 'text-sage-300'}`} />
              At least 8 characters
            </div>
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <CheckCircle2 className={`w-3 h-3 ${password === confirmPassword && password !== '' ? 'text-sage-500' : 'text-sage-300'}`} />
              Passwords match
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-sage-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-sage-500/20 hover:bg-sage-600 transition-all active:scale-[0.98] mt-2"
          >
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};
