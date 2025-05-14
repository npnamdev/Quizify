import React from "react";
import { Notification } from "@/hooks/useNotification";

interface NotificationListProps {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    markAsRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    unreadCount: number;
}


const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    deleteNotification,
}) => {
    if (loading) return <div className="p-4 text-gray-500">Loading notifications...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
            <div className="p-4 border-b text-lg font-semibold text-gray-800">
                Notifications{" "}
                {unreadCount > 0 && (
                    <span className="ml-2 text-sm text-white bg-blue-600 px-2 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>

            <ul className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                    <li className="p-4 text-gray-500 text-center">No notifications</li>
                ) : (
                    notifications.map((n) => (
                        <li
                            key={n._id}
                            className={`p-4 hover:bg-gray-50 transition-all cursor-pointer flex justify-between items-start ${n.status === "unread" ? "bg-blue-50" : "bg-white"
                                }`}
                            onClick={() => {
                                if (n.status === "unread") markAsRead(n._id);
                            }}
                        >
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-800">{n.title}</h3>
                                <p className="text-sm text-gray-600">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                {n.status === "unread" && (
                                    <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded-full mb-2">
                                        New
                                    </span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn sự kiện click truyền lên
                                        deleteNotification(n._id);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default NotificationList;
