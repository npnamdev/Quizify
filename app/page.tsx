"use client";

import React from "react";
import { useNotification } from "@/hooks/useNotification";
import NotificationList from "@/components/ui-custom/NotificationList";

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    deleteNotification,
  } = useNotification();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NotificationList
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        error={error}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
      />
    </div>
  );
};

export default NotificationsPage;
