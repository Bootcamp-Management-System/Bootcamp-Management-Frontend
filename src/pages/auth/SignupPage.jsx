import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, IdCard, UserPlus, ArrowLeft, UserRound } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { useAuth } from '../../context/AuthContext';
import { signupSchema, zodToFormikErrors } from '../../validation/authSchemas';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const SignupPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const navigate = useNavigate();
  const { signup } = useAuth();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      campusId: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const parsed = signupSchema.safeParse(values);
      if (parsed.success) {
        return {};
      }

      return zodToFormikErrors(parsed.error);
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      setSuccess('');

      try {
        await signup({
          fullName: values.fullName.trim(),
          campusId: values.campusId.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
        localStorage.setItem('prebootcamp_auth', JSON.stringify({
          fullName: values.fullName.trim(),
          campusId: values.campusId.trim(),
          email: values.email.trim().toLowerCase(),
        }));
        setSuccess('Registration complete. Redirecting to task page...');
        setTimeout(() => navigate('/prebootcamp/tasks'), 900);
      } catch (err) {
        setError(err.message || 'Unable to create account.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
  }`;

  const labelClass = `mb-2 block text-sm font-semibold ${isDark ? 'text-[#e7eeff]' : 'text-[#1c2742]'}`;

  return (
    <AuthCardLayout
      title="Create Account"
      subtitle="Set up your BMS account with your campus details"
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

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <UserRound className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
            <input
              name="fullName"
              type="text"
              required
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.fullName}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Astu Campus ID</label>
          <div className="relative">
            <IdCard className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
            <input
              name="campusId"
              type="text"
              required
              value={formik.values.campusId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="ugr/12345/15"
              className={inputClass}
            />
          </div>
          {formik.touched.campusId && formik.errors.campusId && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.campusId}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
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
          {formik.touched.password && formik.errors.password && (
            <p className="mt-2 text-sm font-medium text-[#f85149]">{formik.errors.password}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Confirm Password</label>
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

        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}
        {success && <p className="text-sm font-medium text-[#3fb950]">{success}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus className="h-5 w-5" />
          {formik.isSubmitting ? 'Submitting Application...' : 'Register'}
        </button>
      </form>
    </AuthCardLayout>
  );
};