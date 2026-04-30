import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, ArrowUpCircle, UserPlus, FileCheck, Calendar, X, Megaphone, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { notificationService } from '../../../../services/notificationService';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'ANNOUNCEMENT': return Megaphone;
    case 'SESSION': return Calendar;
    case 'ASSIGNMENT': return FileCheck;
    case 'TASK': return CheckCircle;
    case 'MEMBERSHIP': return UserPlus;
    default: return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'ANNOUNCEMENT': return 'bg-[#ddf4ff] dark:bg-[#2f81f7]/20 text-[#0969da] dark:text-[#58a6ff]';
    case 'SESSION': return 'bg-[#e6ffed] dark:bg-[#238636]/20 text-[#1a7f37] dark:text-[#3fb950]';
    case 'ASSIGNMENT': return 'bg-[#fff8c5] dark:bg-[#d29922]/20 text-[#9a6700] dark:text-[#d29922]';
    default: return 'bg-[#f6f8fa] dark:bg-[#30363d] text-[#57606a] dark:text-[#8b949e]';
  }
};

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    await markAllAsRead();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#cf222e] text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Stay updated on all admin activities and system events.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] hover:bg-[#ffebe9] dark:hover:bg-[#f85149]/20 border border-[#d0d7de] dark:border-[#30363d] text-[#cf222e] dark:text-[#ff7b72] rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
            filter === 'all'
              ? "bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da] dark:border-[#2f81f7]"
              : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]"
          )}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
            filter === 'unread'
              ? "bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da] dark:border-[#2f81f7]"
              : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]"
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <div 
              key={notification._id}
              className={cn(
                "bg-white dark:bg-[#161b22] border rounded-xl p-5 shadow-sm transition-all group",
                notification.isRead 
                  ? "border-[#d0d7de] dark:border-[#30363d] opacity-75 hover:opacity-100" 
                  : "border-[#0969da] dark:border-[#2f81f7] shadow-md"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2.5 rounded-lg shrink-0", getNotificationColor(notification.type))}>
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
                          onClick={() => markAsRead(notification._id)}
                          className="p-1.5 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#2f81f7]/20 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1.5 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#f85149]/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#57606a] dark:text-[#8b949e] mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#57606a] dark:text-[#8b949e]">
                      {new Date(notification.createdAt).toLocaleString()}
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

        {filteredNotifications.length === 0 && (
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-[#57606a] dark:text-[#8b949e] mb-4 opacity-50" />
            <p className="text-[#24292f] dark:text-[#c9d1d9] font-medium">No notifications</p>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">
              {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}