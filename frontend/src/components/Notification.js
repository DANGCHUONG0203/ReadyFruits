import React from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

const NotificationItem = ({ notification }) => {
  const { removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon(notification.type)}
        </div>
        <div className="notification-text">
          {notification.title && (
            <div className="notification-title">{notification.title}</div>
          )}
          <div className="notification-message">{notification.message}</div>
        </div>
        <button 
          className="notification-close"
          onClick={() => removeNotification(notification.id)}
          aria-label="Đóng thông báo"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationContainer;