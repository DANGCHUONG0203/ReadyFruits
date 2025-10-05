import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // 'success', 'error', 'warning', 'info'
      title: '',
      message: '',
      duration: 5000, // Auto dismiss after 5 seconds
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenient methods for different notification types
  const showSuccess = useCallback((message, title = 'Thành công') => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 3000
    });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Lỗi') => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 5000
    });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Cảnh báo') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 4000
    });
  }, [addNotification]);

  const showInfo = useCallback((message, title = 'Thông tin') => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 3000
    });
  }, [addNotification]);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};