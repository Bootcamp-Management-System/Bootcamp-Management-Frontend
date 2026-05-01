import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import csecLogo from '../assets/csec-logo.jpg';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  TrendingUp,
  Layers as LayersIcon,
  Calendar,
  ShieldCheck,
  Zap,
  Timer,
  Globe
} from 'lucide-react';

const MotionAside = motion.aside;
const MotionDiv = motion.div;

export const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavItems = () => {
    const dashboardPath = user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/dashboard';
    
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      const adminItems = [
        { id: 'admin-dashboard', icon: LayoutDashboard, label: user.role === 'super_admin' ? t('sidebar.workspace', 'Dashboard') : t('sidebar.dashboard', 'Dashboard'), path: user.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard' },
        { id: 'admin-recruitment', icon: TrendingUp, label: t('sidebar.recruitment', 'Recruitment Hub'), path: '/admin/recruitment' },
      ];

      if (user.role === 'admin') {
        adminItems.push({ id: 'admin-members', icon: Users, label: t('sidebar.students', 'Students'), path: '/admin/members' });
        adminItems.push({ id: 'admin-bootcamps', icon: GraduationCap, label: t('sidebar.bootcamps', 'Bootcamps'), path: '/admin/bootcamps' });
        adminItems.push({ id: 'admin-instructors', icon: GraduationCap, label: t('sidebar.instructors', 'Instructors'), path: '/admin/instructors' });
        adminItems.push({ id: 'admin-sessions', icon: Calendar, label: t('sidebar.sessions', 'Sessions'), path: '/admin/sessions' });
      }

      if (user.role === 'super_admin') {
        adminItems.push({ id: 'admin-bootcamps', icon: GraduationCap, label: t('sidebar.bootcamps', 'Bootcamps'), path: '/super-admin/bootcamps' });
        adminItems.push({ id: 'admin-divisions', icon: LayersIcon, label: t('sidebar.divisions', 'Divisions'), path: '/super-admin/divisions' });
        adminItems.push({ id: 'admin-users', icon: Users, label: t('sidebar.users', 'Users'), path: '/super-admin/users' });
        adminItems.push({ id: 'admin-announcements', icon: BookOpen, label: t('sidebar.announcements', 'Announcements'), path: '/super-admin/announcements' });
        adminItems.push({ id: 'admin-admins', icon: Shield, label: t('sidebar.admins', 'Admins'), path: '/admin/admins' });
      }

      return [{ title: t('sidebar.admin_sec', 'Admin'), items: adminItems }];
    }

    if (user?.role === 'instructor') {
      return [{
        title: t('sidebar.instructor_sec', 'Instructor'),
        items: [
          { id: 'dashboard', icon: LayoutDashboard, label: t('sidebar.panel', 'Panel'), path: '/instructor' },
          { id: 'sessions', icon: Calendar, label: t('sidebar.sessions', 'Sessions'), path: '/instructor/sessions' },
        ]
      }];
    }

    const studentSections = [
      {
        title: t('sidebar.main_sec', 'Main'),
        items: [
          { id: 'dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard', 'Dashboard'), path: dashboardPath },
        ]
      },
      {
        title: t('sidebar.academy_sec', 'Academy'),
        items: [
          { id: 'explore-bootcamps', icon: Globe, label: t('sidebar.explore', 'Explore'), path: '/bootcamps' },
          { id: 'enrollments', icon: ShieldCheck, label: t('sidebar.enrollments', 'Enrollments'), path: '/enrollments' },
        ]
      },
      {
        title: t('sidebar.tracking_sec', 'Tracking'),
        items: [
          { id: 'applications', icon: BookOpen, label: t('sidebar.applications', 'Applications'), path: '/applications' },
          { id: 'progress', icon: TrendingUp, label: t('sidebar.progress', 'Progress'), path: '/progress' },
        ]
      }
    ];

    const isMember = user?.is_Member || (user?.memberships && user.memberships.some(m => m.isMember));
    if (isMember) {
      studentSections[1].items.unshift({ id: 'member-hub', icon: LayersIcon, label: t('sidebar.member_hub', 'Member Hub'), path: '/member-hub' });
    }

    return studentSections;
  };

  const navSections = getNavItems();

  return (
    <MotionAside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="bg-portal-card border-r border-portal-border flex flex-col shrink-0 relative transition-colors duration-300 z-[100]"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-portal-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-portal-accent/20 z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>

      <div className={`p-6 flex-1 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
          <div className="w-11 h-11 rounded-2xl bg-white/95 shadow-lg shadow-portal-accent/15 shrink-0 overflow-hidden ring-1 ring-white/10">
            <img src={csecLogo} alt="CSEC logo" className="h-full w-full object-cover" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <MotionDiv initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h1 className="font-extrabold text-lg leading-none text-portal-text tracking-tight">CSEC ASTU</h1>
                <p className="text-[10px] text-portal-accent mt-1 uppercase tracking-widest font-bold">
                  Portal {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'member' ? 'Student' : user?.role}
                </p>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>


        <nav className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              {!isCollapsed && (
                <h3 className="px-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em]">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.id}
                      to={item.path || '#'}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                        isActive ? 'bg-portal-accent/10 text-portal-accent' : 'text-portal-text-muted hover:bg-portal-text/5 hover:text-portal-text'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-portal-accent' : ''}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </MotionAside>
  );
};
