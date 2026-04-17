import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useDashboardTheme } from '../context/DashboardThemeContext';

export const Navbar = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useDashboardTheme();

  return (
    <header className={`h-20 backdrop-blur-xl border-b flex items-center justify-between px-8 shrink-0 ${isDark ? 'bg-[#161b22]/90 border-[#30363d]' : 'bg-white/80 border-[#d0d7de]'}`}>
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-md w-full">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[#8b949e]' : 'text-[#6e7681]'}`} />
          <input 
            type="text" 
            placeholder="Search..." 
            className={`w-full rounded-xl border py-2.5 pl-11 pr-4 text-sm transition-colors focus:outline-none ${isDark ? 'border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#8b949e] focus:border-[#37b6c9]' : 'border-[#d0d7de] bg-white text-[#1f2328] placeholder:text-[#57606a] focus:border-[#37b6c9]'}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${isDark ? 'border-[#30363d] bg-white text-[#1f2328] hover:border-[#8b949e]' : 'border-[#d0d7de] bg-white text-[#1f2328] hover:border-[#8c959f]'}`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className={`relative rounded-lg p-2 transition-all ${isDark ? 'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#e6edf3]' : 'text-[#57606a] hover:bg-[#f6f8fa] hover:text-[#1f2328]'}`}>
          <Bell className="w-5 h-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>
        
        <div className={`flex items-center gap-3 pl-4 border-l ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name}</p>
            <p className={`mt-1 text-[10px] uppercase font-bold ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{user?.role}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#37b6c9] text-xs font-bold text-white shadow-lg shadow-[#37b6c9]/20">
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
