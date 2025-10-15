"use client";
import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import styles from './NotificationCenter.module.css';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    requestPermission,
    isPermissionGranted,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'usdc':
        return '$';
      case 'nft':
        return 'N';
      case 'activity':
        return 'A';
      case 'success':
        return '✓';
      case 'error':
        return '!';
      default:
        return '•';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'usdc':
        return styles.usdcNotification;
      case 'nft':
        return styles.nftNotification;
      case 'activity':
        return styles.activityNotification;
      case 'success':
        return styles.successNotification;
      case 'error':
        return styles.errorNotification;
      default:
        return styles.defaultNotification;
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Show success notification
      const { addNotification } = useNotifications();
      addNotification({
        type: 'success',
        title: 'Notifications Enabled',
        message: 'You\'ll now receive real-time alerts for USDC and NFT activity!',
      });
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg className={styles.bellIcon} viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            <div className={styles.actions}>
              {!isPermissionGranted && (
                <button
                  className={styles.permissionButton}
                  onClick={handleRequestPermission}
                >
                  Enable Alerts
                </button>
              )}
              {notifications.length > 0 && (
                <>
                  <button
                    className={styles.markAllButton}
                    onClick={markAllAsRead}
                  >
                    Mark All Read
                  </button>
                  <button
                    className={styles.clearAllButton}
                    onClick={clearAllNotifications}
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: '48px', height: '48px' }}>
                    <path
                      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p>All caught up!</p>
                <p className={styles.emptySubtext}>
                  Real-time alerts for USDC payments, NFT mints, and new activities will appear here
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notification} ${getNotificationColor(notification.type)} ${
                    !notification.read ? styles.unread : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h4 className={styles.notificationTitle}>{notification.title}</h4>
                      <span className={styles.notificationTime}>
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    {!notification.read && <div className={styles.unreadDot} />}
                  </div>
                  <button
                    className={styles.clearButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                    aria-label="Clear notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
