import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import csecLogo from '../assets/csec logo.jpg';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  Shield,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  FileBarChart,
  TrendingUp,
  Layers as LayersIcon,
  Rocket,
  RefreshCw,
  Calendar
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const panelLabel =
    user?.role === 'admin'
      ? 'Admin Panel'
      : user?.role === 'instructor'
        ? 'Instructor Panel'
        : 'Student Panel';

  const getNavItems = () => {
    const dashboardPath = user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/dashboard';
    const base = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: dashboardPath },
    ];

    if (user?.role === 'admin' || user?.role === 'super_admin') {
      const adminItems = [
        { id: 'admin-dashboard', icon: LayoutDashboard, label: user.role === 'super_admin' ? 'Global Dashboard' : 'Dashboard', path: '/admin/dashboard' },
        { id: 'admin-recruitment', icon: TrendingUp, label: 'Recruitment Hub', path: '/admin/recruitment' },
        { id: 'admin-members', icon: Users, label: 'Members', path: '/admin/members' },
        { id: 'admin-instructors', icon: UserCheck, label: 'Instructors', path: '/admin/instructors' },
        { id: 'admin-sessions', icon: Calendar, label: 'Sessions', path: '/admin/sessions' },
      ];

      if (user.role === 'super_admin') {
        adminItems.push({ id: 'admin-admins', icon: Shield, label: 'Admins', path: '/admin/admins' });
        adminItems.push({ id: 'super-admin-workspace', icon: GraduationCap, label: 'Super Admin Workspace', path: '/super-admin/dashboard' });
      }

      return [
        ...adminItems,
        { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel', path: '/instructor' },
        { id: 'tasks', icon: ClipboardList, label: 'Tasks', path: '/instructor/tasks' },
        { id: 'attendance', icon: UserCheck, label: 'Attendance', path: '/instructor/attendance' },
        { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
      ];
    }

    return [
      ...base,
      { id: 'bootcamps', icon: Rocket, label: 'Explore Bootcamps', path: '/bootcamps' },
      { id: 'my-tasks', icon: ClipboardList, label: 'My Tasks', path: '/my-tasks' },
      { id: 'progress', icon: TrendingUp, label: 'Weekly Progress', path: '/progress' },
      { id: 'profile', icon: User, label: 'My Profile', path: '/profile' },
    ];
  };

  const navItems = getNavItems();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="bg-portal-card border-r border-portal-border flex flex-col shrink-0 relative transition-colors duration-300"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-portal-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-portal-accent/20 z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>

      <div className={`p-6 flex-1 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
          <div className="w-11 h-11 rounded-2xl bg-white/95 shadow-lg shadow-portal-accent/15 shrink-0 overflow-hidden ring-1 ring-white/10">
            <img
              src={csecLogo}
              alt="CSEC logo"
              className="h-full w-full object-cover"
            />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h1 className="font-extrabold text-lg leading-none text-portal-text tracking-tight">CSEC ASTU</h1>
                <p className="text-[10px] text-portal-accent mt-1 uppercase tracking-widest font-bold">
                  Portal {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'member' ? 'Student' : user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dual-Role Switcher */}
        {(user?.originalRole === 'instructor' || (user?.role === 'instructor' && !user?.originalRole)) && (
          <div className={`mb-6 ${isCollapsed ? 'px-0 flex justify-center' : 'px-2'}`}>
            <button
              onClick={() => {
                switchRole();
                navigate(user.role === 'instructor' ? '/dashboard' : '/instructor');
              }}
              title={isCollapsed ? `Switch to ${user.role === 'instructor' ? 'Student' : 'Instructor'}` : undefined}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                user.role === 'instructor' 
                  ? 'bg-portal-input border border-portal-border text-portal-text hover:bg-portal-bg' 
                  : 'bg-portal-accent text-white hover:bg-portal-accent-hover shadow-portal-accent/20'
              } ${isCollapsed ? 'px-0 w-10 h-10' : 'px-4'}`}
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Switch to {user.role === 'instructor' ? 'Student' : 'Instructor'}</span>}
            </button>
          </div>
        )}

        <nav className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.id}
                to={item.path || '#'}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative
                  ${isActive
                    ? 'bg-portal-accent/10 text-portal-accent'
                    : 'text-portal-text-muted hover:bg-portal-text/5 hover:text-portal-text'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-portal-accent' : ''}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isCollapsed && isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-portal-accent rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-6 pt-6 border-t border-portal-border space-y-2 ${isCollapsed ? 'items-center' : ''}`}>
          <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-portal-text-muted hover:text-portal-text transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
