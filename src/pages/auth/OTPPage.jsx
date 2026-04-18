import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { verifyOTP, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(otp.join(''));
      if (user?.isFirstLogin) {
        navigate('/change-password');
      } else {
        navigate('/login');
      }
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-bg relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-portal-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-portal-card border border-portal-border rounded-[32px] p-10 shadow-2xl relative z-10 text-center"
      >
        <div className="w-16 h-16 bg-portal-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-portal-accent" />
        </div>
        
        <h1 className="text-2xl font-bold text-white">Verify Identity</h1>
        <p className="text-portal-text-muted mt-2 mb-8">
          We've sent a 6-digit code to <br />
          <span className="font-bold text-white">{user?.email || 'your email'}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 text-center text-xl font-bold bg-portal-input border border-portal-border text-white rounded-xl focus:outline-none focus:border-portal-accent transition-all"
              />
            ))}
          </div>

          <button 
            type="submit"
            className="w-full bg-portal-accent text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all flex items-center justify-center gap-2"
          >
            Verify & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-sm text-portal-text-muted mt-8">
          Didn't receive the code? <br />
          <button className="text-portal-accent font-bold hover:underline mt-1">Resend OTP</button>
        </p>
      </motion.div>
    </div>
  );
};
