import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, Mail, Lock, IdCard, UserPlus, ArrowLeft } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const SignupPage = () => {
  const [campusId, setCampusId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const navigate = useNavigate();

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!campusId.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSuccess('Account created successfully. Redirecting to login...');
    setTimeout(() => navigate('/login'), 1200);
  };

  const inputClass = `w-full border px-11 py-3.5 text-base focus:outline-none ${
    isDark
      ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:border-[#2f81f7]'
      : 'border-[#d0d7de] bg-white text-[#1f2328] placeholder:text-[#8c959f] focus:border-[#0969da]'
  }`;

  const labelClass = `mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`;

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
        className={`mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e] hover:text-[#e6edf3]' : 'text-[#57606a] hover:text-[#1f2328]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Astu Campus ID</label>
          <div className="relative">
            <IdCard className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
            <input
              type="text"
              required
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              placeholder="ugr/12345/15"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
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

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Confirm Password</label>
          <div className="relative">
            <BadgeCheck className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}
        {success && <p className="text-sm font-medium text-[#3fb950]">{success}</p>}

        <button
          type="submit"
          className={`flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-white ${
            isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
          }`}
        >
          <UserPlus className="h-5 w-5" />
          Sign Up
        </button>
      </form>
    </AuthCardLayout>
  );
};