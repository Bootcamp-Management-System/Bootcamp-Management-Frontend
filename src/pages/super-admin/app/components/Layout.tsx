import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CalendarDays,
  Megaphone,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../../lib/utils';
import { useAuth } from '../../../../context/AuthContext';

const SUPER_ADMIN_BASE = '/super-admin';

const navItems = [
  { path: `${SUPER_ADMIN_BASE}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
  { path: `${SUPER_ADMIN_BASE}/divisions`, label: 'Divisions', icon: Building2 },
  { path: `${SUPER_ADMIN_BASE}/users`, label: 'Users', icon: Users },
  { path: `${SUPER_ADMIN_BASE}/applications`, label: 'Applications', icon: FileText },
  { path: `${SUPER_ADMIN_BASE}/sessions`, label: 'Sessions', icon: CalendarDays },
  { path: `${SUPER_ADMIN_BASE}/announcements`, label: 'Announcements', icon: Megaphone },
  { path: `${SUPER_ADMIN_BASE}/settings`, label: 'Settings', icon: Settings },
];

export function Layout() {
  const { theme, setTheme } = useTheme();
  const auth = useAuth() as { logout?: () => void };
  const navigate = useNavigate();
  const location = useLocation();

  const isNotificationsPage = location.pathname === `${SUPER_ADMIN_BASE}/notifications`;

  const handleLogout = () => {
    auth.logout?.();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#c9d1d9] transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-[#161b22] border-r border-[#d0d7de] dark:border-[#30363d] sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-[#d0d7de] dark:border-[#30363d] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#24292f] dark:bg-[#c9d1d9] flex items-center justify-center text-white dark:text-[#0d1117] font-bold">
            BMS
          </div>
          <span className="font-semibold text-lg tracking-tight">Super Admin</span>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-[#0969da] text-white dark:bg-[#1f6feb] dark:text-white font-medium'
                    : 'text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f3f4f6] dark:hover:bg-[#21262d]'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#d0d7de] dark:border-[#30363d] space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0969da] to-[#1a7f37] flex items-center justify-center text-white font-semibold shadow-sm">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Alex Superadmin</span>
              <span className="text-xs text-[#57606a] dark:text-[#8b949e]">System Owner</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#d0d7de] dark:border-[#30363d] px-3 py-2 text-sm font-medium text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#490202] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-[#161b22] border-b border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between px-6 z-10">
          <h1 className="text-lg font-semibold">Bootcamp Management System</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`${SUPER_ADMIN_BASE}/notifications`)}
              className={cn(
                'relative p-2 rounded-md transition-colors',
                isNotificationsPage
                  ? 'bg-[#0969da] text-white dark:bg-[#1f6feb]'
                  : 'hover:bg-[#f3f4f6] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e]'
              )}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className={cn(
                'absolute top-1.5 right-1.5 w-2 h-2 rounded-full border',
                isNotificationsPage
                  ? 'bg-white border-[#1f6feb]'
                  : 'bg-[#cf222e] border-white dark:border-[#161b22]'
              )}></span>
            </button>
            <div className="h-6 w-px bg-[#d0d7de] dark:bg-[#30363d]"></div>
            <div className="flex items-center gap-1 bg-[#f6f8fa] dark:bg-[#21262d] p-1 rounded-lg border border-[#d0d7de] dark:border-[#30363d]">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  theme === 'light' ? 'bg-white shadow-sm text-[#24292f]' : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]'
                )}
                title="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  theme === 'system' ? 'bg-white dark:bg-[#30363d] shadow-sm text-[#24292f] dark:text-[#c9d1d9]' : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]'
                )}
                title="System theme"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  theme === 'dark' ? 'bg-[#30363d] shadow-sm text-[#c9d1d9]' : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]'
                )}
                title="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
