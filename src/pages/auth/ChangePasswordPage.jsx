import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { changePasswordSchema, zodToFormikErrors } from '../../validation/authSchemas';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const ChangePasswordPage = () => {
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { changePassword, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = location.state?.email || user?.email || '';

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
        const response = await changePassword(values.password, targetEmail);
        const role = response.user?.role || user?.role || 'member';
        navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
      } catch (err) {
        setError(err.message || 'Failed to update password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const inputClass = `w-full border px-11 py-3.5 text-base focus:outline-none ${
    isDark
      ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:border-[#2f81f7]'
      : 'border-[#d0d7de] bg-white text-[#1f2328] placeholder:text-[#8c959f] focus:border-[#0969da]'
  }`;

  return (
    <AuthCardLayout
      title="Set New Password"
      subtitle="Create a secure password to continue"
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      <div className="mb-8 flex justify-center">
        <div className={`flex h-12 w-12 items-center justify-center border ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-white'}`}>
          <KeyRound className={`h-6 w-6 ${isDark ? 'text-[#2f81f7]' : 'text-[#0969da]'}`} />
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>New Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
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
          <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Confirm Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
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

        <div className={`border px-4 py-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
          <p className={`mb-3 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Requirements</p>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-base ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${formik.values.password.length >= 8 ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              At least 8 characters
            </div>
            <div className={`flex items-center gap-2 text-base ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${formik.values.password === formik.values.confirmPassword && formik.values.password !== '' ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              Passwords match
            </div>
          </div>
        </div>

        {!targetEmail && <p className="text-sm font-medium text-[#f85149]">Email session is missing. Restart from login or forgot password.</p>}
        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting || !targetEmail}
          className={`flex w-full items-center justify-center px-4 py-3.5 text-base font-semibold text-white ${
            isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {formik.isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthCardLayout>
  );
};
