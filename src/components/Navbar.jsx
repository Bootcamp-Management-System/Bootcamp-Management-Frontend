import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { divisionService } from '../services/divisionService';
import { notificationService } from '../services/notificationService';
import { Bell, Search, User, LogOut, ChevronDown, RefreshCw, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import csecLogo from '../assets/csec-logo.jpg';

const MotionDiv = motion.div;

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', name: 'Oromo', flag: '🇪🇹' },
    { code: 'ti', name: 'Tigrinya', flag: '🇪🇹' },
    { code: 'so', name: 'Somali', flag: '🇸🇴' }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-portal-border hover:bg-white/10 transition-all group"
        title="Change Language"
      >
        <Globe className="w-5 h-5 text-portal-accent group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold text-portal-text uppercase hidden sm:inline">{currentLanguage.code}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-48 bg-portal-card border border-portal-border rounded-2xl shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-xl"
            >
              <div className="px-3 py-2 mb-1 border-b border-portal-border/50">
                <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">{t('nav.switch_to', 'Switch Language')}</p>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    i18n.language === lang.code 
                    ? 'bg-portal-accent/10 text-portal-accent font-bold' 
                    : 'text-portal-text-muted hover:text-portal-text hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-portal-accent" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const { user, selectedDivision, setGlobalDivision, logout, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setDivisionOptions] = React.useState(['All']);
  const divisionLabelMap = {
    Development: 'Development',
    Cyber: 'Cyber Security',
    DataScience: 'Data Science',
    CPD: 'CP (Competitive Programming)',
  };
  const divisionButtons = ['All', 'Development', 'Cyber', 'DataScience', 'CPD'];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'default' : 'light');
  };

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

  React.useEffect(() => {
    let isMounted = true;

    const loadUnreadNotifications = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await notificationService.getNotifications({ status: 'unread', limit: 100 });
        if (isMounted) {
          let notifs = response.data?.data || [];
          if (user?.role === 'instructor') {
            notifs = notifs.filter(n => n.type !== 'SESSION');
          }
          setUnreadCount(notifs.length);
        }
      } catch {
        if (isMounted) setUnreadCount(0);
      }
    };

    loadUnreadNotifications();
    const intervalId = window.setInterval(loadUnreadNotifications, 30000);
    window.addEventListener('notifications:changed', loadUnreadNotifications);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener('notifications:changed', loadUnreadNotifications);
    };
  }, [user]);

  return (
    <header className="h-20 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border flex items-center justify-between px-8 shrink-0 relative z-50">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder={t('nav.search', 'Search...')}
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
        {/* Theme Toggle & Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all focus:outline-none"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        
        <ThemeSwitcher />
        <LanguageSwitcher />

        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/10 rounded-lg transition-all relative"
          title={t('nav.notifications', 'Notifications')}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-portal-bg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Profile Section */}
        <div className="relative ml-2">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 pl-4 border-l border-portal-border group transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-portal-text group-hover:text-portal-accent transition-colors">{user?.name || 'User'}</p>
              <p className="text-[10px] text-portal-accent mt-1 uppercase font-black tracking-wider leading-none">
                {user?.is_Member ? 'Member' : user?.role === 'member' ? 'Student' : user?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-portal-accent flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-portal-accent/20 border border-white/10 uppercase ring-2 ring-transparent group-hover:ring-portal-accent/30 transition-all">
              {user?.name?.substring(0, 2) || '??'}
            </div>
            <ChevronDown className={`w-4 h-4 text-portal-text-muted transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <MotionDiv 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileDropdown(false)}
                />
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-3 w-64 bg-portal-card border border-portal-border rounded-2xl shadow-2xl z-50 p-2 overflow-hidden ring-1 ring-black/10 backdrop-blur-xl"
                >
                  <div className="px-4 py-3 mb-2 border-b border-portal-border/50">
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">{t('nav.profile', 'My Profile')} ({user?.role})</p>
                    <p className="text-sm font-bold text-portal-text truncate">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-portal-text hover:bg-portal-accent/10 hover:text-portal-accent transition-all text-left"
                    >
                      <User className="w-4 h-4" /> {t('nav.profile', 'My Profile')}
                    </button>
                    {/* Role Switcher */}
                    {['super_admin', 'admin', 'instructor'].includes(user?.originalRole || user?.role) && (
                      <div className="pt-2 mt-2 border-t border-portal-border/50">
                        <p className="px-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">View Portal As</p>
                        {['super_admin', 'admin'].includes(user?.originalRole || user?.role) && (
                          <button 
                            onClick={() => { switchRole('admin'); navigate('/admin/dashboard'); setShowProfileDropdown(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${user?.role === 'admin' || user?.role === 'super_admin' ? 'bg-portal-accent/10 text-portal-accent' : 'text-portal-text hover:bg-portal-text/5'}`}
                          >
                            <RefreshCw className="w-4 h-4" /> Admin
                          </button>
                        )}
                        <button 
                          onClick={() => { switchRole('instructor'); navigate('/instructor'); setShowProfileDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${user?.role === 'instructor' ? 'bg-portal-accent/10 text-portal-accent' : 'text-portal-text hover:bg-portal-text/5'}`}
                        >
                          <RefreshCw className="w-4 h-4" /> Instructor
                        </button>
                        <button 
                          onClick={() => { switchRole('student'); navigate('/dashboard'); setShowProfileDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${user?.role === 'student' || user?.role === 'member' ? 'bg-portal-accent/10 text-portal-accent' : 'text-portal-text hover:bg-portal-text/5'}`}
                        >
                          <RefreshCw className="w-4 h-4" /> Student
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="my-2 border-t border-portal-border/50" />
                  
                  <button 
                    onClick={() => { logout(); setShowProfileDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-red-400 hover:bg-red-400/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" /> {t('nav.logout', 'Logout')}
                  </button>
                </MotionDiv>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
