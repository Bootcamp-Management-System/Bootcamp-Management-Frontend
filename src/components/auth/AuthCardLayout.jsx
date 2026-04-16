import React from 'react';
import { Moon, Sun } from 'lucide-react';
import logoImage from '../../assets/csec logo.jpg';

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
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-5 ${isDark ? 'bg-[#0d1117] text-[#e6edf3]' : 'bg-[#f6f8fa] text-[#1f2328]'}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top,_rgba(56,139,253,0.18),_transparent_45%)]'
            : 'bg-[radial-gradient(circle_at_top,_rgba(9,105,218,0.12),_transparent_45%)]'
        }`}
      />

      <div className={`relative w-full ${compact ? 'max-w-[430px]' : 'max-w-[520px]'}`}>
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8 sm:gap-4">
          <img
            src={logoImage}
            alt="CSEC logo"
            className="h-[76px] w-[76px] rounded-full border border-[#8b949e] object-cover shadow-[0_14px_30px_rgba(0,0,0,0.48)] sm:h-[100px] sm:w-[100px]"
          />
          <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>CSEC ASTU</h1>
        </div>

        <section
          className={`${
            isDark
              ? 'border-[#30363d] bg-[#161b22] shadow-[0_18px_40px_rgba(0,0,0,0.5)]'
              : 'border-[#d0d7de] bg-white shadow-[0_18px_40px_rgba(31,35,40,0.16)]'
          } relative border ${compact ? 'p-4 sm:p-6' : 'p-5 sm:p-7'}`}
        >
          {showThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center border sm:right-4 sm:top-4 ${
                isDark
                  ? 'border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#8b949e]'
                  : 'border-[#d0d7de] bg-white text-[#57606a] hover:border-[#8c959f]'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          <header className={`text-center ${compact ? 'mb-5 sm:mb-6' : 'mb-6 sm:mb-7'}`}>
            <h2 className={`${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-semibold leading-tight ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>{title}</h2>
            <p className={`mt-2 ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'} ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>{subtitle}</p>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
};
