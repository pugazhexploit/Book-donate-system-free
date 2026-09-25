import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStore } from '../services/store';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const all = localStore.getNotifications();
    const userNotifs = all.filter(n => n.user_id === user.id);
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter(n => !n.is_read).length);
  };

  useEffect(() => {
    loadNotifications();
    // Poll/check periodically
    const timer = setInterval(loadNotifications, 5000);
    return () => clearInterval(timer);
  }, [user]);

  const markAsRead = (id) => {
    const all = localStore.getNotifications();
    const index = all.findIndex(n => n.id === id);
    if (index !== -1) {
      all[index].is_read = true;
      localStore.saveNotifications(all);
      loadNotifications();
    }
  };

  const markAllAsRead = () => {
    if (!user) return;
    const all = localStore.getNotifications();
    all.forEach(n => {
      if (n.user_id === user.id) n.is_read = true;
    });
    localStore.saveNotifications(all);
    loadNotifications();
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      refreshNotifications: loadNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
