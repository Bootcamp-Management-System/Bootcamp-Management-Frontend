import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-sage-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-sage-50 border border-sage-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-sage-500 hover:text-sage-900 hover:bg-sage-100 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-sage-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name}</p>
            <p className="text-[10px] text-sage-500 mt-1 uppercase font-bold">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-sage-500/20">
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
