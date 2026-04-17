import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock3, MailCheck, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

export const WaitingApprovalPage = () => {
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isMockApproving, setIsMockApproving] = useState(false);
  const [theme, setTheme] = useState(getAuthTheme);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const { approvalSession, checkApproval, mockApproveUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const targetEmail = location.state?.email || approvalSession?.email || '';

  useEffect(() => {
    persistAuthTheme(theme);
  }, [theme]);

  const handleCheckStatus = async () => {
    if (!targetEmail) return;

    setIsChecking(true);
    setError('');

    try {
      const result = await checkApproval(targetEmail);
      setStatus(result.approvalStatus);
      if (result.isApproved) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Unable to check approval status.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleMockApprove = async () => {
    if (!targetEmail) return;

    setIsMockApproving(true);
    setError('');

    try {
      await mockApproveUser(targetEmail);
      setStatus('approved');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Unable to run mock approval.');
    } finally {
      setIsMockApproving(false);
    }
  };

  return (
    <AuthCardLayout
      title="Waiting for Admin Approval"
      subtitle="Your account is verified. An admin must approve your application before login."
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

      <div className={`mb-5 rounded-2xl border px-4 py-3 ${isDark ? 'border-[#1f3158] bg-[#031037]' : 'border-[#bcc2cc] bg-[#f4f5f7]'}`}>
        <div className="mb-3 flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-[#37b6c9]" />
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-[#a5b2cd]' : 'text-[#596a8a]'}`}>Application Status</p>
        </div>
        <p className={`text-sm ${isDark ? 'text-[#edf3ff]' : 'text-[#1f2328]'}`}>
          {status === 'approved' ? 'Approved' : 'Pending Review'}
        </p>
        {targetEmail && (
          <p className={`mt-2 text-xs ${isDark ? 'text-[#a3b0cb]' : 'text-[#5f6f8f]'}`}>
            Email: {targetEmail}
          </p>
        )}
      </div>

      {!targetEmail && <p className="mb-4 text-sm font-medium text-[#f85149]">Approval session missing. Please register again.</p>}
      {error && <p className="mb-4 text-sm font-medium text-[#f85149]">{error}</p>}

      <button
        type="button"
        onClick={handleCheckStatus}
        disabled={isChecking || !targetEmail}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#37b6c9] px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCcw className="h-5 w-5" />
        {isChecking ? 'Checking...' : 'Check Approval Status'}
      </button>

      <button
        type="button"
        onClick={handleMockApprove}
        disabled={isMockApproving || !targetEmail}
        className={`flex w-full items-center justify-center gap-2 rounded-[18px] border px-4 py-3.5 text-sm font-bold transition ${
          isDark
            ? 'border-[#1f3158] bg-[#031037] text-[#e6efff] hover:border-[#3d4f77]'
            : 'border-[#bcc2cc] bg-[#f4f5f7] text-[#1f2a47] hover:border-[#8f99ab]'
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <MailCheck className="h-5 w-5" />
        {isMockApproving ? 'Applying Mock Approval...' : 'Mock: Approve My Account'}
      </button>
    </AuthCardLayout>
  );
};
