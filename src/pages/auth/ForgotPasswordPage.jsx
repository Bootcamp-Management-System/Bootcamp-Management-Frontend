import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { forgotPasswordSchema, zodToFormikErrors } from '../../validation/authSchemas';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const inputClass = `w-full border px-11 py-3.5 text-base focus:outline-none ${
    isDark
      ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:border-[#2f81f7]'
      : 'border-[#d0d7de] bg-white text-[#1f2328] placeholder:text-[#8c959f] focus:border-[#0969da]'
  }`;

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate: (values) => {
      const parsed = forgotPasswordSchema.safeParse(values);
      if (parsed.success) {
        return {};
      }

      return zodToFormikErrors(parsed.error);
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const payload = await forgotPassword(values.email.trim().toLowerCase());
        setIsSubmitted(true);
        setTimeout(() => navigate('/otp', { state: { email: payload.email, purpose: 'forgot-password' } }), 1500);
      } catch (err) {
        setError(err.message || 'Error sending reset code');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthCardLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive a reset verification code"
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      <Link
        to="/login"
        className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e] hover:text-[#e6edf3]' : 'text-[#57606a] hover:text-[#1f2328]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      {!isSubmitted ? (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Email Address</label>
            <div className="relative">
              <Mail className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
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
            {error && <p className="mt-2 text-sm font-medium text-[#f85149]">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-white ${
              isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Code'}
            <Send className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <div className={`border px-6 py-8 text-center ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'}`}>
            <Send className={`h-6 w-6 ${isDark ? 'text-[#2f81f7]' : 'text-[#0969da]'}`} />
          </div>
          <p className={`text-lg font-semibold ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>Check your inbox</p>
          <p className={`mt-2 text-base ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>A reset code has been sent. Redirecting to OTP...</p>
        </div>
      )}
    </AuthCardLayout>
  );
};
