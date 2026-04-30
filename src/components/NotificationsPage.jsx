import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Check, CheckCheck, FileCheck, Info, Megaphone, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { notificationService } from '../services/notificationService';

const notificationTypes = ['all', 'ANNOUNCEMENT', 'SESSION', 'ASSIGNMENT', 'TASK', 'MEMBERSHIP'];
const notifyCountChanged = () => window.dispatchEvent(new Event('notifications:changed'));

const getNotificationIcon = (type) => {
  switch (type) {
    case 'ANNOUNCEMENT': return Megaphone;
    case 'SESSION': return Calendar;
    case 'ASSIGNMENT': return FileCheck;
    case 'TASK': return Check;
    case 'MEMBERSHIP': return UserPlus;
    default: return Info;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'ANNOUNCEMENT': return 'bg-[#ddf4ff] dark:bg-[#2f81f7]/20 text-[#0969da] dark:text-[#58a6ff]';
    case 'SESSION': return 'bg-[#e6ffed] dark:bg-[#238636]/20 text-[#1a7f37] dark:text-[#3fb950]';
    case 'ASSIGNMENT': return 'bg-[#fff8c5] dark:bg-[#d29922]/20 text-[#9a6700] dark:text-[#d29922]';
    case 'TASK': return 'bg-[#f4ecff] dark:bg-[#8250df]/20 text-[#8250df] dark:text-[#d2a8ff]';
    case 'MEMBERSHIP': return 'bg-[#dafbe1] dark:bg-[#2ea043]/20 text-[#1a7f37] dark:text-[#3fb950]';
    default: return 'bg-[#f6f8fa] dark:bg-[#30363d] text-[#57606a] dark:text-[#8b949e]';
  }
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export const NotificationsPage = ({
  title = 'Notifications',
  subtitle = 'Stay updated on announcements, assignments, sessions, and membership activity.',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getNotifications({ limit: 100 });
      setNotifications(res.data?.data || []);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !notification.isRead) ||
        (statusFilter === 'read' && notification.isRead);
      const matchesType = typeFilter === 'all' || notification.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [notifications, statusFilter, typeFilter]);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification,
      ),
    );
    notifyCountChanged();
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
      notifyCountChanged();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((current) => current.filter((notification) => notification._id !== id));
      notifyCountChanged();
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const openNotification = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification._id);
      }
      if (notification.link) {
        const target =
          notification.link === '/notifications' && location.pathname.startsWith('/super-admin')
            ? '/super-admin/notifications'
            : notification.link;
        navigate(target);
      }
    } catch {
      toast.error('Failed to open notification');
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-[#d0d7de] bg-white px-3 py-2 text-sm font-medium text-[#24292f] shadow-sm transition-colors hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9] dark:hover:bg-[#30363d]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-3">
            {title}
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#cf222e] text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">{subtitle}</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { value: 'all', label: `All (${notifications.length})` },
          { value: 'unread', label: `Unread (${unreadCount})` },
          { value: 'read', label: `Read (${notifications.length - unreadCount})` },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cx(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              statusFilter === tab.value
                ? 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da] dark:border-[#2f81f7]'
                : 'bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {notificationTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={cx(
              'px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors',
              typeFilter === type
                ? 'bg-portal-accent text-white border-portal-accent'
                : 'bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:text-[#24292f] dark:hover:text-[#c9d1d9]',
            )}
          >
            {type === 'all' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-8 text-center text-sm text-[#57606a] dark:text-[#8b949e]">
            Loading notifications...
          </div>
        )}

        {!isLoading && filteredNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <div
              key={notification._id}
              role="button"
              tabIndex={0}
              onClick={() => openNotification(notification)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') openNotification(notification);
              }}
              className={cx(
                'bg-white dark:bg-[#161b22] border rounded-xl p-5 shadow-sm transition-all group cursor-pointer',
                notification.isRead
                  ? 'border-[#d0d7de] dark:border-[#30363d] opacity-80 hover:opacity-100 hover:border-[#8b949e]'
                  : 'border-[#0969da] dark:border-[#2f81f7] shadow-md',
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cx('p-2.5 rounded-lg shrink-0', getNotificationColor(notification.type))}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="p-1.5 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#2f81f7]/20 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-1.5 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#f85149]/20 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#57606a] dark:text-[#8b949e] mb-2">
                    {notification.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#57606a] dark:text-[#8b949e]">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f6f8fa] dark:bg-[#30363d] text-[#57606a] dark:text-[#8b949e]">
                      {notification.type}
                    </span>
                    {!notification.isRead && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0969da] text-white">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && filteredNotifications.length === 0 && (
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-[#57606a] dark:text-[#8b949e] mb-4 opacity-50" />
            <p className="text-[#24292f] dark:text-[#c9d1d9] font-medium">No notifications</p>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">
              {statusFilter === 'unread' ? "You're all caught up!" : "There are no notifications for this filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
