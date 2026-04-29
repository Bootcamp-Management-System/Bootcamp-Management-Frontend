import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore
import csecLogo from '../../../../assets/csec logo.jpg';
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
  Laptop,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../../lib/utils';
import { useAuth } from '../../../../context/AuthContext';

const SUPER_ADMIN_BASE = '/super-admin';

const navItems = [
  { path: `${SUPER_ADMIN_BASE}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
  { path: `${SUPER_ADMIN_BASE}/divisions`, label: 'Divisions', icon: Building2 },
  { path: `${SUPER_ADMIN_BASE}/users`, label: 'Users', icon: Users },
  { path: `${SUPER_ADMIN_BASE}/announcements`, label: 'Announcements', icon: Megaphone },
];

export function Layout() {
  const { theme, setTheme } = useTheme();
  const auth = useAuth() as { logout?: () => void; user?: { name?: string } };
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isNotificationsPage = location.pathname === `${SUPER_ADMIN_BASE}/notifications`;
  const userName = auth.user?.name || 'Super Admin';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const isDarkTheme =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleThemeToggle = () => {
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-portal-bg text-portal-text font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className={cn(
        'flex-shrink-0 flex flex-col bg-portal-card border-r border-portal-border h-screen overflow-visible relative transition-all duration-300',
        isCollapsed ? 'w-24' : 'w-72'
      )}>
        <button
          onClick={() => setIsCollapsed((current) => !current)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-4 top-6 h-9 w-9 bg-portal-accent rounded-full flex items-center justify-center text-white border-2 border-portal-bg shadow-xl shadow-portal-accent/40 z-50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-portal-accent focus:ring-offset-2 focus:ring-offset-portal-card transition-transform"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
        <div className="p-6 border-b border-portal-border flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-lg shadow-portal-accent/10 ring-1 ring-white/10">
            <img
              src={csecLogo}
              alt="CSEC logo"
              className="h-full w-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg leading-none tracking-tight text-portal-text">CSEC BMS</h1>
              <p className="mt-1 text-[11px] font-semibold tracking-wide text-portal-accent">Super Admin Panel</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all relative',
                  isActive
                    ? 'bg-portal-accent/10 text-portal-accent'
                    : 'text-portal-text-muted hover:bg-white/5 hover:text-portal-text'
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-portal-bg">
        {/* Header */}
        <header className="h-20 flex-shrink-0 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-lg font-bold text-portal-text">Bootcamp Management System</h1>
            <p className="text-xs text-portal-text-muted mt-1">Super Admin workspace</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleThemeToggle}
              className="p-2.5 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all"
              title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate(`${SUPER_ADMIN_BASE}/notifications`)}
              className={cn(
                'relative p-2.5 rounded-lg transition-colors',
                isNotificationsPage
                  ? 'bg-portal-accent/15 text-portal-accent'
                  : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10'
              )}
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className={cn(
                'absolute top-2 right-2 w-2 h-2 rounded-full border-2',
                isNotificationsPage
                  ? 'bg-portal-accent border-portal-bg'
                  : 'bg-red-500 border-portal-bg'
              )}></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-portal-border">
              <button 
                onClick={() => navigate(`${SUPER_ADMIN_BASE}/settings`)}
                className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity focus:outline-none"
                title="Go to Settings"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-base font-extrabold leading-none text-portal-text">{userName}</p>
                  <p className="text-xs text-portal-accent mt-1 uppercase font-bold tracking-wider">super admin</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-portal-accent flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-portal-accent/20 border border-white/10 uppercase">
                  {userInitials || 'SA'}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-portal-accent/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="super-admin-theme relative z-10 min-h-full bg-transparent p-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
