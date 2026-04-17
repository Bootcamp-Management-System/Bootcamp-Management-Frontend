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

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
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
        setTimeout(() => navigate('/verify-otp', { state: { email: payload.email, purpose: 'forgot-password' } }), 1500);
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
        className={`mb-6 inline-flex items-center gap-2 text-sm font-semibold transition ${isDark ? 'text-[#a3b0cb] hover:text-[#e6efff]' : 'text-[#5f6f8f] hover:text-[#1c2844]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      {!isSubmitted ? (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-[#e7eeff]' : 'text-[#1c2742]'}`}>Email</label>
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
            {error && <p className="mt-2 text-sm font-medium text-[#f85149]">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Code'}
            <Send className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <div className={`rounded-2xl border px-5 py-6 text-center ${isDark ? 'border-[#1f3158] bg-[#031037]' : 'border-[#bcc2cc] bg-[#f4f5f7]'}`}>
          <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? 'border-[#1f3158] bg-[#051641]' : 'border-[#bcc2cc] bg-white'}`}>
            <Send className="h-5 w-5 text-[#37b6c9]" />
          </div>
          <p className={`text-base font-semibold ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>Check your inbox</p>
          <p className={`mt-2 text-sm ${isDark ? 'text-[#9aa7c4]' : 'text-[#4d5b78]'}`}>A reset code has been sent. Redirecting to OTP...</p>
        </div>
      )}
    </AuthCardLayout>
  );
};
