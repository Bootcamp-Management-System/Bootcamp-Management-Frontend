import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ArrowLeft, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { changePasswordSchema, zodToFormikErrors } from '../../validation/authSchemas';
import { useAuth } from '../../context/AuthContext';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const ResetPasswordPage = () => {
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const { resetPassword, otpSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = location.state?.email || otpSession?.email || '';

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const parsed = changePasswordSchema.safeParse(values);
      if (parsed.success) {
        return {};
      }

      return zodToFormikErrors(parsed.error);
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        await resetPassword(values.password, targetEmail);
        navigate('/login');
      } catch (err) {
        setError(err.message || 'Failed to reset password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
  }`;

  return (
    <AuthCardLayout
      title="Reset Password"
      subtitle="Set a new password for your account"
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      <Link
        to="/login"
        className={`mb-6 inline-flex items-center gap-2 text-sm font-semibold transition ${isDark ? 'text-[#a3b0cb] hover:text-[#e6efff]' : 'text-[#5f6f8f] hover:text-[#1c2844]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="mb-6 flex justify-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${isDark ? 'border-[#1f3158] bg-[#031037]' : 'border-[#bcc2cc] bg-[#f4f5f7]'}`}>
          <KeyRound className="h-5 w-5 text-[#37b6c9]" />
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-[#e7eeff]' : 'text-[#1c2742]'}`}>New Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              name="password"
              type="password"
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.password}</p>
          )}
        </div>

        <div>
          <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-[#e7eeff]' : 'text-[#1c2742]'}`}>Confirm Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              name="confirmPassword"
              type="password"
              required
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {!targetEmail && <p className="text-sm font-medium text-[#f85149]">OTP reset session missing. Start from forgot password.</p>}
        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}

        <div className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-[#1f3158] bg-[#031037]' : 'border-[#bcc2cc] bg-[#f4f5f7]'}`}>
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-[#a5b2cd]' : 'text-[#596a8a]'}`}>Requirements</p>
          <div className="space-y-1.5">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${formik.values.password.length >= 8 ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              At least 8 characters
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${formik.values.password === formik.values.confirmPassword && formik.values.password !== '' ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              Passwords match
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || !targetEmail}
          className="flex w-full items-center justify-center rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthCardLayout>
  );
};
