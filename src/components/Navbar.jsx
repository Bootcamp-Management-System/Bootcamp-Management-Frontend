import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Search resources, tasks..." 
            className="w-full bg-portal-input border border-portal-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-portal-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-portal-text-muted hover:text-white hover:bg-portal-accent/10 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-portal-bg" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-portal-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-white">{user?.name}</p>
            <p className="text-[10px] text-portal-accent mt-1 uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-portal-accent flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-portal-accent/20 border border-white/10 uppercase">
            {user?.name?.substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};
