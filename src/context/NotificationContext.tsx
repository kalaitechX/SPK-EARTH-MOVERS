import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: (page?: number, limit?: number, unreadOnly?: boolean) => Promise<any>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Socket and Fetch Initial Data
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const token = localStorage.getItem('spk_token');
    if (!token) return;

    const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    setSocket(newSocket);

    // Initial fetch
    fetchInitialData();

    // Socket Event Listeners
    newSocket.on('notification:new', (notification: any) => {
      setNotifications(prev => {
        // Prevent duplicates
        if (prev.some(n => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
      setUnreadCount(prev => prev + 1);
      
      // Optional: Add a subtle toast or sound here
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [countRes, notifRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getNotifications({ limit: 10 })
      ]);
      if (countRes.success) setUnreadCount(countRes.count);
      if (notifRes.success) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (page = 1, limit = 20, unreadOnly = false) => {
    try {
      const res = await notificationService.getNotifications({ page, limit, unreadOnly });
      if (res.success) {
        // We don't overwrite global state to avoid resetting live updates, just return for component to use
        return res;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      markAsRead,
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
