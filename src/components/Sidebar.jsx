import React from 'react';
import { useAuth } from '../context/AuthContext';
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

  const getNavItems = () => {
    const base = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    if (user?.role === 'admin') {
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
    <aside className="w-64 bg-sage-50 border-r border-sage-200 flex flex-col shrink-0">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center shadow-lg shadow-sage-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">CSEC BMS</h1>
            <p className="text-[10px] text-sage-500 mt-1 uppercase tracking-widest font-bold">{user?.role} Panel</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group text-sage-600 hover:bg-sage-100 hover:text-sage-900"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-sage-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sage-500 hover:text-sage-900 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
