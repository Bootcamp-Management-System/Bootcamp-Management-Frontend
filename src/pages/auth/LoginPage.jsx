import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { loginSchema, zodToFormikErrors } from '../../validation/authSchemas';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const LoginPage = () => {
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const parsed = loginSchema.safeParse(values);
      if (parsed.success) {
        return {};
      }

      return zodToFormikErrors(parsed.error);
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const result = await login(values.email.trim(), values.password);
        if (result.requiresApproval) {
          navigate('/waiting-approval', { state: { email: result.user.email } });
          return;
        }

        if (result.requiresPasswordChange) {
          navigate('/force-change-password', { state: { email: result.user.email, purpose: 'force-change-password' } });
          return;
        }

        const role = result.user.role;
        navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
      } catch (err) {
        setError(err.message || 'Invalid email or password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
  }`;
  const labelClass = `mb-2 block text-sm font-semibold ${isDark ? 'text-[#e9eeff]' : 'text-[#1c2742]'}`;

  return (
    <AuthCardLayout
      title="Welcome Back"
      subtitle="Sign in to your BMS account"
      compact
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email</label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              name="email"
              type="email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Password</label>
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

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className={`text-sm font-semibold transition ${isDark ? 'text-[#9aa8c9] hover:text-[#d5ddf5]' : 'text-[#6b7892] hover:text-[#2f3f60]'}`}
            >
              Forgot Password?
            </Link>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.password}</p>
          )}
        </div>

        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn className="h-5 w-5" />
          {formik.isSubmitting ? 'Checking...' : 'Access Portal'}
        </button>

        <div className="pt-1 text-center">
          <p className={`text-sm ${isDark ? 'text-[#97a5c5]' : 'text-[#5e6c88]'}`}>
            If you have not registered yet,{' '}
            <Link
              to="/register"
              className={`font-bold uppercase tracking-wide transition ${isDark ? 'text-[#d9e7ff] hover:text-white' : 'text-[#223257] hover:text-[#121a33]'}`}
            >
              click here to register
            </Link>
          </p>
        </div>
      </form>
    </AuthCardLayout>
  );
};
