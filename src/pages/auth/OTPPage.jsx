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
  const { verifyOTP, resendOTP, user, otpSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = location.state?.email || otpSession?.email || user?.email || '';
  const flowPurpose = location.state?.purpose || otpSession?.purpose || 'forgot-password';

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
        await verifyOTP(values.otp, targetEmail, flowPurpose);

        if (flowPurpose === 'register') {
          navigate('/waiting-approval', { state: { email: targetEmail } });
          return;
        }

        navigate('/reset-password', { state: { email: targetEmail, purpose: 'forgot-password' } });
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
      await resendOTP(targetEmail, flowPurpose);
      setOtp(['', '', '', '', '', '']);
      setResendStatus({ type: 'success', message: 'OTP resent successfully.' });
    } catch {
      setResendStatus({ type: 'error', message: 'Unable to resend OTP. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  const otpInputClass = `h-12 w-10 rounded-2xl border text-center text-xl font-semibold transition focus:outline-none sm:h-14 sm:w-12 ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] focus:border-[#37b6c9]'
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
        className={`mb-6 inline-flex items-center gap-2 text-sm font-semibold transition ${isDark ? 'text-[#a3b0cb] hover:text-[#e6efff]' : 'text-[#5f6f8f] hover:text-[#1c2844]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      {resendStatus.message && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
            resendStatus.type === 'success'
              ? 'border-[#238636] bg-[#0f271a] text-[#52db79]'
              : 'border-[#da3633] bg-[#2d1111] text-[#ff6a66]'
          }`}
        >
          {resendStatus.message}
        </div>
      )}

      <div className="mb-6 flex justify-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${isDark ? 'border-[#1f3158] bg-[#031037]' : 'border-[#bcc2cc] bg-[#f4f5f7]'}`}>
          <ShieldCheck className="h-5 w-5 text-[#37b6c9]" />
        </div>
      </div>

      {!targetEmail && (
        <p className="mb-4 text-sm font-medium text-[#f85149]">Email session missing. Restart from login or forgot password.</p>
      )}

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6 flex justify-center gap-2 sm:gap-3">
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
          className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formik.isSubmitting ? 'Verifying...' : 'Verify and Continue'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className={`mt-6 border-t pt-5 text-center ${isDark ? 'border-[#1f3158]' : 'border-[#bfc4cd]'}`}>
        <p className={`text-sm ${isDark ? 'text-[#a1aecb]' : 'text-[#5f6f8f]'}`}>Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={isResending}
          className={`mt-2 text-sm font-semibold transition disabled:cursor-not-allowed ${
            isDark
              ? 'text-[#d9e7ff] hover:text-white disabled:text-[#6e7f9e]'
              : 'text-[#223257] hover:text-[#121a33] disabled:text-[#8c95a7]'
          }`}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </AuthCardLayout>
  );
};
