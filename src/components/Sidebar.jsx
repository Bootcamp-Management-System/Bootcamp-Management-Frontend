import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Shield,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/dashboard';
    const base = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: dashboardPath },
    ];

    if (user?.role === 'admin') {
      return [
        ...base,
        { id: 'users', icon: Users, label: 'User Management', path: '/users' },
        { id: 'divisions', icon: BookOpen, label: 'Divisions', path: '/divisions' },
        { id: 'security', icon: Shield, label: 'Security', path: '/security' },
        { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        ...base,
        { id: 'sessions', icon: BookOpen, label: 'Sessions', path: '/sessions' },
        { id: 'tasks', icon: ClipboardList, label: 'Task Management', path: '/tasks' },
        { id: 'students', icon: Users, label: 'Students', path: '/students' },
        { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
      ];
    }

    return [
      ...base,
      { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
      { id: 'my-sessions', icon: BookOpen, label: 'My Sessions', path: '/my-sessions' },
      { id: 'my-tasks', icon: ClipboardList, label: 'My Tasks', path: '/my-tasks' },
    ];
  };

  return (
    <aside className="w-64 bg-portal-card border-r border-portal-border flex flex-col shrink-0">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-portal-accent rounded-xl flex items-center justify-center shadow-lg shadow-portal-accent/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none text-white tracking-tight">CSEC ASTU</h1>
            <p className="text-[10px] text-portal-accent mt-1 uppercase tracking-widest font-bold">Portal {user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {getNavItems().map((item) => (
            <Link
              key={item.id}
              to={item.path || '#'}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group text-portal-text-muted hover:bg-portal-accent/10 hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-portal-border space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-portal-text-muted hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
