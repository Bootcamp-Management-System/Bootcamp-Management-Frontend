import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboardTheme } from '../context/DashboardThemeContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Shield
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useDashboardTheme();

  const getNavItems = () => {
    const base = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    if (user?.role === 'admin' || user?.role === 'superadmin') {
      return [
        ...base,
        { id: 'users', icon: Users, label: 'User Management' },
        { id: 'divisions', icon: BookOpen, label: 'Divisions' },
        { id: 'security', icon: Shield, label: 'Security' },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        ...base,
        { id: 'sessions', icon: BookOpen, label: 'Sessions' },
        { id: 'tasks', icon: ClipboardList, label: 'Task Management' },
        { id: 'students', icon: Users, label: 'Students' },
      ];
    }

    return [
      ...base,
      { id: 'my-sessions', icon: BookOpen, label: 'My Sessions' },
      { id: 'my-tasks', icon: ClipboardList, label: 'My Tasks' },
    ];
  };

  return (
    <aside className={`w-64 flex shrink-0 flex-col border-r ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'}`}>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#37b6c9] shadow-lg shadow-[#37b6c9]/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-lg font-bold leading-none ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>CSEC BMS</h1>
            <p className={`mt-1 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{user?.role} Panel</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isDark ? 'text-[#c9d1d9] hover:bg-[#0d1117] hover:text-[#f0f6fc]' : 'text-[#57606a] hover:bg-[#f6f8fa] hover:text-[#1f2328]'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              <ChevronRight className="ml-auto w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </nav>

        <div className={`mt-6 space-y-1 border-t pt-6 ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
          <button className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${isDark ? 'text-[#8b949e] hover:text-[#f0f6fc]' : 'text-[#57606a] hover:text-[#1f2328]'}`}>
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#f85149] transition-colors hover:text-[#da3633]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
