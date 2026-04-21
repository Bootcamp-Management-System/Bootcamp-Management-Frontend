import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Moon, Search, Sun } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('bms-theme') || 'dark');

  const isDarkTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const appliedTheme =
      theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(appliedTheme);
    localStorage.setItem('bms-theme', appliedTheme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((current) => {
      const currentlyDark =
        current === 'dark' ||
        (current === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return currentlyDark ? 'light' : 'dark';
    });
  };

  return (
    <header className="h-20 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Search resources, tasks..." 
            className="w-full bg-portal-input border border-portal-border rounded-xl py-3 pl-12 pr-4 text-base font-semibold text-white placeholder:text-portal-text-muted focus:outline-none focus:border-portal-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleThemeToggle}
          className="p-2.5 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all"
          title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2.5 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-portal-bg" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-portal-border">
          <div className="text-right hidden sm:block">
            <p className="text-base font-extrabold leading-none text-portal-text">{user?.name}</p>
            <p className="text-xs text-portal-accent mt-1 uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-portal-accent flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-portal-accent/20 border border-white/10 uppercase">
            {user?.name?.substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};
