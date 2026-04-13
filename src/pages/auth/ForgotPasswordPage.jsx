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
      setTimeout(() => navigate('/otp'), 2000);
    } catch (err) {
      alert('Error sending reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-sage-200"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-sage-500 hover:text-sage-700 uppercase tracking-widest mb-8">
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="text-2xl font-bold text-sage-900">Forgot Password?</h1>
          <p className="text-sage-500 mt-2">Enter your email and we'll send you a code to reset your password.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-sage-500 uppercase mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-sage-50 border border-sage-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-sage-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-sage-500/20 hover:bg-sage-600 transition-all flex items-center justify-center gap-2"
            >
              Send Reset Code
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-sage-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Send className="w-6 h-6" />
            </div>
            <p className="font-bold text-sage-900">Check your inbox!</p>
            <p className="text-sm text-sage-500 mt-2">We've sent a reset code to your email.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
