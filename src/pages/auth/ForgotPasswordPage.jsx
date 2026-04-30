import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      setTimeout(() => navigate('/otp', { state: { email, purpose: 'forgot-password' } }), 2000);
    } catch (err) {
      alert('Error sending reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-bg relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-portal-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-portal-card border border-portal-border rounded-[32px] p-10 shadow-2xl relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-portal-text-muted hover:text-portal-text uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-portal-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-portal-accent" />
          </div>
          <h1 className="text-2xl font-bold text-portal-text">Forgot Password?</h1>
          <p className="text-portal-text-muted mt-2">Enter your email and we'll send you a code to reset your password.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-portal-text ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@astu.edu.et"
                  className="w-full bg-portal-input border border-portal-border rounded-xl py-4 pl-12 pr-4 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-portal-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all flex items-center justify-center gap-2"
            >
              Send Reset Code
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-portal-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Send className="w-6 h-6" />
            </div>
            <p className="font-bold text-portal-text">Check your inbox!</p>
            <p className="text-sm text-portal-text-muted mt-2">We've sent a reset code to your email.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
