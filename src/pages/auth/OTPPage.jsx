import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { otpSchema, zodToFormikErrors } from '../../validation/authSchemas';
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
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { verifyOTP, resendOTP, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = location.state?.email || user?.email || '';
  const flowPurpose = location.state?.purpose || (user?.isFirstLogin ? 'first-login' : 'forgot-password');

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validate: (values) => {
      const parsed = otpSchema.safeParse(values);
      if (parsed.success) {
        return {};
      }

      return zodToFormikErrors(parsed.error);
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        await verifyOTP(values.otp, targetEmail);

        if (flowPurpose === 'first-login') {
          navigate('/change-password', { state: { email: targetEmail, purpose: 'first-login' } });
          return;
        }

        navigate('/change-password', { state: { email: targetEmail, purpose: 'forgot-password' } });
      } catch (err) {
        setError(err.message || 'Invalid OTP');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!resendStatus.message) return undefined;

    const timer = setTimeout(() => {
      setResendStatus({ type: '', message: '' });
    }, 2500);

    return () => clearTimeout(timer);
  }, [resendStatus]);

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    const nextOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(nextOtp);
    formik.setFieldValue('otp', nextOtp.join(''));

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendStatus({ type: '', message: '' });
    setError('');

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
      <button
        type="button"
        onClick={() => navigate('/login')}
        className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e] hover:text-[#e6edf3]' : 'text-[#57606a] hover:text-[#1f2328]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

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

      {!targetEmail && (
        <p className="mb-4 text-sm font-medium text-[#f85149]">Email session missing. Restart from login or forgot password.</p>
      )}

      <form onSubmit={formik.handleSubmit}>
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

        {formik.errors.otp && <p className="mb-4 text-sm font-medium text-[#f85149]">{formik.errors.otp}</p>}
        {error && <p className="mb-4 text-sm font-medium text-[#f85149]">{error}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting || !targetEmail}
          className={`flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-white ${
            isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {formik.isSubmitting ? 'Verifying...' : 'Verify and Continue'}
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
