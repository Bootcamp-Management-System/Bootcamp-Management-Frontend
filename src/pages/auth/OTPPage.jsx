import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetStep, setResetStep] = useState('otp');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { verifyOTP, resendOtp, forgotPassword, resetPassword, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [email, setEmail] = useState(
    location.state?.email || 
    queryParams.get('email') || 
    user?.email || 
    localStorage.getItem('pending_otp_email') || 
    ''
  );
  const purpose = location.state?.purpose || queryParams.get('purpose') || 'register';
  const isPasswordReset = purpose === 'forgot-password';
  const otpValue = otp.join('');

  const handleChange = (value, index) => {
    if (isNaN(Number(value)) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.querySelectorAll('input[name="otp-input"]')[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.querySelectorAll('input[name="otp-input"]')[index - 1];
        if (prevInput) {
          prevInput.focus();
          // Optional: clear previous input on backspace move
          // const newOtp = [...otp];
          // newOtp[index - 1] = '';
          // setOtp(newOtp);
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelectorAll('input[name="otp-input"]')[index - 1];
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelectorAll('input[name="otp-input"]')[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedNumbers) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedNumbers.length; i++) {
        newOtp[i] = pastedNumbers[i];
      }
      setOtp(newOtp);
      
      // Focus the last filled input or the next empty one
      const targetIndex = Math.min(pastedNumbers.length, 5);
      const inputs = document.querySelectorAll('input[name="otp-input"]');
      if (inputs[targetIndex]) {
        inputs[targetIndex].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required. Please go back to login.');
      return;
    }
    
    if (isPasswordReset && resetStep === 'otp') {
      if (otpValue.length !== 6) {
        setError('Enter the 6-digit reset code from your email.');
        return;
      }

      setResetStep('password');
      setResendMessage('');
      return;
    }

    if (isPasswordReset) {
      if (!newPassword || newPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      if (isPasswordReset) {
        await resetPassword({
          email,
          otp: otpValue,
          newPassword,
        });

        localStorage.removeItem('dev_otp');
        setSuccessMessage('Password reset successful. You can now log in with your new password.');
        setTimeout(() => navigate('/login', { replace: true }), 2500);
        return;
      } else {
        await verifyOTP({
          email,
          otp: otpValue,
        });
      }
      
      // Clear dev OTP
      localStorage.removeItem('dev_otp');
      
      const targetBootcamp = location.state?.bootcampId;
      if (targetBootcamp) {
        navigate(`/apply/${targetBootcamp}`);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err?.message || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is required to resend OTP.');
      return;
    }

    setResendLoading(true);
    setError('');
    setResendMessage('');

    try {
      if (isPasswordReset) {
        await forgotPassword(email);
      } else {
        await resendOtp({ email });
      }
      setResendMessage('OTP sent successfully! Check your email.');
    } catch (err) {
      setError(err?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
        
        <h1 className="text-2xl font-bold text-portal-text">
          {isPasswordReset ? 'Reset Password' : 'Verify Identity'}
        </h1>
        <p className="text-portal-text-muted mt-2 mb-4">
          {isPasswordReset 
            ? resetStep === 'otp'
              ? 'Enter the reset code sent to your email'
              : 'Create your new password'
            : "We've sent a 6-digit code to your email"}
        </p>

        {email && (
          <p className="text-portal-text font-bold mb-6">{email}</p>
        )}

        {successMessage ? (
          <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-400" />
            <p className="text-sm font-bold text-green-400">{successMessage}</p>
            <p className="mt-2 text-xs text-portal-text-muted">Redirecting to login...</p>
          </div>
        ) : null}

        {!successMessage && localStorage.getItem('dev_otp') && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm font-bold">Development Mode: Use OTP</p>
            <p className="text-yellow-400 text-2xl font-mono font-bold tracking-widest">{localStorage.getItem('dev_otp')}</p>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            {(!isPasswordReset || resetStep === 'otp') && (
              <>
                {isPasswordReset && (
                  <div className="relative mb-6">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-portal-input border border-portal-border text-portal-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-portal-accent transition-all"
                    />
                  </div>
                )}

                <div className="flex justify-center gap-2 mb-8">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      name="otp-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={data}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-xl font-bold bg-portal-input border border-portal-border text-portal-text rounded-xl focus:outline-none focus:border-portal-accent transition-all"
                    />
                  ))}
                </div>
              </>
            )}

            {isPasswordReset && resetStep === 'password' && (
              <div className="space-y-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setResetStep('otp');
                    setError('');
                  }}
                  className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-portal-text-muted transition-colors hover:text-portal-accent"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to code
                </button>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-portal-input border border-portal-border text-portal-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-portal-accent transition-all"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-portal-input border border-portal-border text-portal-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-portal-accent transition-all"
                />
              </div>
            )}

            {error ? (
              <p className="text-xs text-red-400 mb-4">{error}</p>
            ) : null}

            <button
              type="submit"
              className="w-full bg-portal-accent text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all flex items-center justify-center gap-2"
            >
              {isPasswordReset && resetStep === 'password' ? 'Reset Password' : 'Verify & Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {!successMessage && (!isPasswordReset || resetStep === 'otp') && (
          <p className="text-sm text-portal-text-muted mt-8">
            Didn't receive the code? <br />
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-portal-accent font-bold hover:underline mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        )}

        {resendMessage && (
          <p className="text-sm text-green-400 mt-2">{resendMessage}</p>
        )}
      </motion.div>
    </div>
  );
};
