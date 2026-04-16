import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState({ type: '', message: '' });
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { verifyOTP, resendOTP, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = user?.email || location.state?.email || '';

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

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

  const otpInputClass = `h-14 w-12 border text-center text-2xl font-semibold focus:outline-none sm:h-16 sm:w-14 ${
    isDark
      ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:border-[#2f81f7]'
      : 'border-[#d0d7de] bg-white text-[#1f2328] focus:border-[#0969da]'
  }`;

  return (
    <AuthCardLayout
      title="Verify Identity"
      subtitle={`Enter the 6-digit code sent to ${targetEmail || 'your email'}`}
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      {resendStatus.message && (
        <div
          className={`mb-6 border px-4 py-3 text-sm font-semibold ${
            resendStatus.type === 'success'
              ? 'border-[#238636] bg-[#0f271a] text-[#3fb950]'
              : 'border-[#da3633] bg-[#2d1111] text-[#f85149]'
          }`}
        >
          {resendStatus.message}
        </div>
      )}

      <div className="mb-8 flex justify-center">
        <div className={`flex h-12 w-12 items-center justify-center border ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-white'}`}>
          <ShieldCheck className={`h-6 w-6 ${isDark ? 'text-[#2f81f7]' : 'text-[#0969da]'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 flex justify-center gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className={otpInputClass}
            />
          ))}
        </div>

        <button
          type="submit"
          className={`flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-white ${
            isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
          }`}
        >
          Verify and Continue
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className={`mt-8 border-t pt-6 text-center ${isDark ? 'border-[#30363d]' : 'border-[#d8dee4]'}`}>
        <p className={`text-base ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={isResending}
          className={`mt-2 text-base font-semibold disabled:cursor-not-allowed ${
            isDark
              ? 'text-[#2f81f7] hover:text-[#58a6ff] disabled:text-[#6e7681]'
              : 'text-[#0969da] hover:text-[#0550ae] disabled:text-[#8c959f]'
          }`}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </AuthCardLayout>
  );
};
