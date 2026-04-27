import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { divisionService } from '../services/divisionService';
import { Bell, Search, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { user, selectedDivision, setGlobalDivision } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setDivisionOptions] = React.useState(['All']);
  const divisionLabelMap = {
    Development: 'Development',
    Cyber: 'Cyber Security',
    DataScience: 'Data Science',
    CPD: 'CP (Competitive Programming)',
  };
  const divisionButtons = ['All', 'Development', 'Cyber', 'DataScience', 'CPD'];

  React.useEffect(() => {
    const loadDivisions = async () => {
      try {
        const response = await divisionService.getDivisions();
        const divisionData = response?.data || response?.data?.data || [];
        const names = Array.isArray(divisionData)
          ? divisionData.map((division) => division.name).filter(Boolean)
          : [];
        setDivisionOptions(['All', ...names]);

        if (selectedDivision && !names.includes(selectedDivision) && selectedDivision !== 'All') {
          setGlobalDivision('All');
        }
      } catch {
        setDivisionOptions(['All']);
      }
    };

    if (user?.role === 'super_admin') {
      loadDivisions();
    }
  }, [user?.role, selectedDivision, setGlobalDivision]);

  return (
    <header className="h-20 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border flex items-center justify-between px-8 shrink-0 relative z-50">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-portal-input border border-portal-border rounded-xl py-2 pl-11 pr-4 text-xs text-portal-text focus:outline-none focus:border-portal-accent transition-colors"
          />
        </div>

        {user?.role === 'super_admin' && (
          <div className="flex items-center gap-2 bg-portal-card border border-portal-border p-1 rounded-xl">
            {divisionButtons.map((div) => {
              const value = div === 'All' ? 'All' : (divisionLabelMap[div] || div);
              const isActive = selectedDivision === value || (div === 'All' && selectedDivision === 'All');
              return (
              <button
                key={div}
                onClick={() => setGlobalDivision(value)}
                className={`
                  px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                  ${isActive 
                    ? 'bg-portal-accent text-white shadow-lg shadow-portal-accent/20' 
                    : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-text/5'
                  }
                `}
              >
                {div === 'All' ? 'Global' : div}
              </button>
            );})}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all focus:outline-none"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-portal-bg" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-portal-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-portal-text">{user?.name}</p>
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
