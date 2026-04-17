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

const getRoleRedirectPath = (role) => {
  if (role === 'superadmin' || role === 'admin') return '/admin';
  if (role === 'instructor') return '/instructor';
  return '/dashboard';
};

export const LoginPage = () => {
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const [demoLoadingRole, setDemoLoadingRole] = useState('');
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { label: 'Super Admin', email: 'superadmin@bms.com' },
    { label: 'Admin', email: 'admin@bms.com' },
    { label: 'Instructor', email: 'instructor@bms.com' },
    { label: 'Student', email: 'student@bms.com' },
  ];

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

        navigate(getRoleRedirectPath(result.user.role));
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
      navigate(getRoleRedirectPath(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  const handleDemoLogin = async (email) => {
    setError('');
    setDemoLoadingRole(email);
    try {
      const result = await login(email, 'Password123');
      if (result?.requiresApproval) {
        navigate('/waiting-approval', { state: { email: result.user.email } });
        return;
      }

      if (result?.requiresPasswordChange) {
        navigate('/force-change-password', { state: { email: result.user.email, purpose: 'force-change-password' } });
        return;
      }

      navigate(getRoleRedirectPath(result.user.role));
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setDemoLoadingRole('');
    }
  };

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
  }`;
  const labelClass = `mb-2 block text-sm font-semibold ${isDark ? 'text-[#e9eeff]' : 'text-[#1c2742]'}`;

  return (
    <div className="relative">
      <header className={`fixed left-0 right-0 top-0 z-20 border-b ${isDark ? 'border-[#203059] bg-[#030d2d]/95' : 'border-[#c6cbd5] bg-[#eceef2]/95'} backdrop-blur`}>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-end px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/prebootcamp-login"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition sm:px-4 ${
                isDark
                  ? 'border-[#2e4067] text-[#d7e2ff] hover:border-[#4c6497] hover:text-white'
                  : 'border-[#b8bfcc] text-[#27385d] hover:border-[#8e99ad]'
              }`}
            >
              Prebootcamp Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-[#37b6c9] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#2ca8bb] sm:px-4"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <AuthCardLayout
          title="Welcome Back"
          compact
          theme={theme}
          showThemeToggle
          onThemeToggle={toggleTheme}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className={`rounded-xl border px-3 py-3 ${isDark ? 'border-[#263454] bg-[#08173f]' : 'border-[#bcc2ce] bg-[#eef1f6]'}`}>
          <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${isDark ? 'text-[#9aa8c9]' : 'text-[#506185]'}`}>
            Demo Login Buttons
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoLogin(account.email)}
                disabled={demoLoadingRole !== '' || formik.isSubmitting}
                className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? 'border-[#2d416a] bg-[#031037] text-[#dce6ff] hover:border-[#4f6598]'
                    : 'border-[#b8bfcc] bg-white text-[#203056] hover:border-[#8e99ad]'
                }`}
              >
                {demoLoadingRole === account.email ? 'Loading...' : account.label}
              </button>
            ))}
          </div>
        </div>

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
          </form>
        </AuthCardLayout>
      </div>
    </div>
  );
};
