import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { NotificationItem } from '../types';
import { api } from '../services/api';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  PiggyBank,
  Info
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { refreshAccounts, showToast } = useBanking();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err: any) {
      showToast(err.message || 'Failed to load notifications', 'error');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
      refreshAccounts();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
      refreshAccounts();
      showToast('All notifications marked as read', 'success');
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      loadNotifications();
      refreshAccounts();
      showToast('Notification deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filtered = filter === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return <ArrowDownLeft size={16} className="text-emerald-600" />;
      case 'SECURITY':
        return <ShieldAlert size={16} className="text-[#DB0011]" />;
      case 'BILL':
        return <Receipt size={16} className="text-amber-500" />;
      case 'DEPOSIT':
        return <PiggyBank size={16} className="text-purple-600" />;
      default:
        return <Info size={16} className="text-zinc-600" />;
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Title & Mark All Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-bank-text">Notifications Centre</h1>
          <p className="text-xs text-bank-muted">Security Advisories & Real-Time Transaction Alerts</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs text-[#DB0011] hover:underline font-semibold"
        >
          <CheckCheck size={14} />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'TRANSACTION', label: 'Transactions' },
          { id: 'SECURITY', label: 'Security' },
          { id: 'BILL', label: 'Bills' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white border border-bank-border text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-bank-border text-center text-zinc-400 text-xs shadow-card">
            No notifications in this folder.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 shadow-card ${
                notif.is_read
                  ? 'bg-white border-bank-border hover:border-zinc-300'
                  : 'bg-red-50/40 border-red-200 ring-1 ring-red-200/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-zinc-900">{notif.title}</h3>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#DB0011]"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {new Date(notif.created_at).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <button
                onClick={e => handleDelete(notif.id, e)}
                className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-600 transition shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
