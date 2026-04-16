import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { useAuthTheme } from './useAuthTheme';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme, isDark, toggleTheme } = useAuthTheme();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      setTimeout(() => navigate('/otp', { state: { email } }), 2000);
    } catch {
      alert('Error sending reset link');
    }
  };

  const inputClass = `w-full border px-11 py-3.5 text-base focus:outline-none ${
    isDark
      ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:border-[#2f81f7]'
      : 'border-[#d0d7de] bg-white text-[#1f2328] placeholder:text-[#8c959f] focus:border-[#0969da]'
  }`;

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Email Address</label>
            <div className="relative">
              <Mail className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-white ${
              isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
            }`}
          >
            Send Reset Code
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
