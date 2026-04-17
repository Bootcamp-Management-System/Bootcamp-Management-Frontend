import React from 'react';
import { Moon, Sun } from 'lucide-react';
import csecLogo from '../../assets/csec logo.jpg';

export const AuthCardLayout = ({
  title,
  subtitle,
  children,
  compact = false,
  theme = 'dark',
  showThemeToggle = false,
  onThemeToggle,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 pb-16 pt-5 sm:px-6 sm:pt-8 ${isDark ? 'bg-[#01051a] text-[#e8eefc]' : 'bg-[#eceef2] text-[#17203a]'}`}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[72%] ${isDark ? 'bg-[#020826]' : 'bg-[#eceef2]'}`} />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-[28%] ${isDark ? 'bg-[#01051a]' : 'bg-[#eceef2]'}`} />
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_20%_0%,rgba(55,182,201,0.2),transparent_45%)]' : 'bg-[radial-gradient(circle_at_20%_0%,rgba(55,182,201,0.12),transparent_45%)]'}`} />

      <div className={`relative mx-auto w-full ${compact ? 'max-w-[480px]' : 'max-w-[600px]'}`}>
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className={`h-14 w-14 rounded-full border p-0.5 ${isDark ? 'border-[#2c3f67] bg-[#0a1538]' : 'border-[#c5c9d0] bg-white'}`}>
            <img
              src={csecLogo}
              alt="CSEC logo"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h1 className={`text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-[#f4f7ff]' : 'text-[#14203b]'}`}>CSEC Bootcamp</h1>
        </div>

        <section
          className={`relative rounded-[24px] border ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-7'} ${
            isDark
              ? 'border-[#263454] bg-[#051132] shadow-[0_18px_50px_rgba(0,0,0,0.45)]'
              : 'border-[#c3c7ce] bg-[#c8cbd1] shadow-[0_14px_35px_rgba(35,45,70,0.16)]'
          }`}
        >
          {(title || subtitle) && (
            <header className={`text-center ${compact ? 'mb-3' : 'mb-4'}`}>
              {title && <h2 className={`text-xl font-extrabold sm:text-2xl ${isDark ? 'text-[#f4f7ff]' : 'text-[#121a33]'}`}>{title}</h2>}
              {subtitle && <p className={`mt-2 text-sm ${isDark ? 'text-[#9aa7c4]' : 'text-[#4d5b78]'}`}>{subtitle}</p>}
            </header>
          )}

          {children}
        </section>

        {showThemeToggle && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                isDark
                  ? 'border-[#2c3f67] bg-[#0a1538] text-[#d9e2ff] hover:border-[#3f5486]'
                  : 'border-[#c5c9d0] bg-white text-[#1d2741] hover:border-[#8c95a5]'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
