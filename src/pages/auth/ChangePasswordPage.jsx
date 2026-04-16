import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const AUTH_THEME_KEY = 'auth_theme';
const LEGACY_LOGIN_THEME_KEY = 'login_theme';

export const ChangePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => {
    const storedAuthTheme = localStorage.getItem(AUTH_THEME_KEY);
    const legacyTheme = localStorage.getItem(LEGACY_LOGIN_THEME_KEY);
    return storedAuthTheme || legacyTheme || 'dark';
  });
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(AUTH_THEME_KEY, theme);
    localStorage.setItem(LEGACY_LOGIN_THEME_KEY, theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword(password);
      const role = user?.role || 'member';
      navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    } catch {
      setError('Failed to update password');
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>New Password</label>
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
          <label className={`mb-2 block text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Confirm Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'}`} />
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

        <div className={`border px-4 py-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
          <p className={`mb-3 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Requirements</p>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-base ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${password.length >= 8 ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              At least 8 characters
            </div>
            <div className={`flex items-center gap-2 text-base ${isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
              <CheckCircle2 className={`h-4 w-4 ${password === confirmPassword && password !== '' ? 'text-[#3fb950]' : 'text-[#6e7681]'}`} />
              Passwords match
            </div>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}

        <button
          type="submit"
          className={`flex w-full items-center justify-center px-4 py-3.5 text-base font-semibold text-white ${
            isDark ? 'bg-[#1f6feb] hover:bg-[#388bfd]' : 'bg-[#0969da] hover:bg-[#0550ae]'
          }`}
        >
          Update Password
        </button>
      </form>
    </AuthCardLayout>
  );
};
