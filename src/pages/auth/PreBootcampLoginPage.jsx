import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IdCard, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const PreBootcampLoginPage = () => {
  const [campusId, setCampusId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

    if (!campusId.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in campus ID, email, and password.');
      return;
    }

    localStorage.setItem(
      'prebootcamp_auth',
      JSON.stringify({
        campusId: campusId.trim(),
        email: email.trim().toLowerCase(),
      }),
    );

    navigate('/prebootcamp/tasks');
  };

  const inputClass = `w-full rounded-[18px] border px-12 py-3.5 text-base font-medium transition focus:outline-none ${
    isDark
      ? 'border-[#1f3158] bg-[#031037] text-[#edf3ff] placeholder:text-[#7b8cae] focus:border-[#37b6c9]'
      : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1b2540] placeholder:text-[#7e8798] focus:border-[#37b6c9]'
  }`;

  const labelClass = `mb-2 block text-sm font-semibold ${isDark ? 'text-[#e9eeff]' : 'text-[#1c2742]'}`;

  return (
    <AuthCardLayout
      title="Prebootcamp Login"
      subtitle="Login to continue with your prebootcamp application tasks"
      compact
      theme={theme}
      showThemeToggle
      onThemeToggle={toggleTheme}
    >
      <Link
        to="/login"
        className={`mb-6 inline-flex items-center gap-2 text-sm font-semibold transition ${isDark ? 'text-[#a3b0cb] hover:text-[#e6efff]' : 'text-[#5f6f8f] hover:text-[#1c2844]'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Main Login
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Campus ID</label>
          <div className="relative">
            <IdCard className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              type="text"
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              placeholder="UGR/12345/15"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <Lock className={`pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#7b8cae]' : 'text-[#8c97ab]'}`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-[#f85149]">{error}</p>}

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb]"
        >
          <LogIn className="h-5 w-5" />
          Continue to Task Page
        </button>
      </form>
    </AuthCardLayout>
  );
};
