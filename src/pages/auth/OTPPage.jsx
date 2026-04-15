import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState({ type: '', message: '' });
  const { verifyOTP, resendOTP, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = user?.email || location.state?.email || '';

  useEffect(() => {
    if (!resendStatus.message) return undefined;

    const timer = setTimeout(() => {
      setResendStatus({ type: '', message: '' });
    }, 2500);

    return () => clearTimeout(timer);
  }, [resendStatus]);

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
    } catch {
      alert('Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendStatus({ type: '', message: '' });

    try {
      await resendOTP(targetEmail);
      setOtp(['', '', '', '', '', '']);
      setResendStatus({ type: 'success', message: 'OTP resent successfully.' });
    } catch {
      setResendStatus({ type: 'error', message: 'Unable to resend OTP. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
      {resendStatus.message && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold shadow-lg border ${
              resendStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {resendStatus.message}
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-sage-200 text-center"
      >
        <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-sage-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-sage-900">Verify Identity</h1>
        <p className="text-sage-500 mt-2 mb-8">
          We've sent a 6-digit code to <br />
          <span className="font-bold text-sage-700">{targetEmail || 'your email'}</span>
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
                className="w-12 h-14 text-center text-xl font-bold bg-sage-50 border border-sage-200 rounded-xl focus:outline-none focus:border-sage-500 transition-colors"
              />
            ))}
          </div>

          <button 
            type="submit"
            className="w-full bg-sage-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-sage-500/20 hover:bg-sage-600 transition-all flex items-center justify-center gap-2"
          >
            Verify & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-sm text-sage-500 mt-8">
          Didn't receive the code? <br />
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending}
            className="text-sage-600 font-bold hover:underline mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
