"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";

const socketUrl = process.env.NEXT_PUBLIC_API_URL!;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!;

export interface Notification {
    _id: string;
    title: string;
    message: string;
    status: "unread" | "read";
    createdAt: string;
}

interface NotificationResponse {
    status: string;
    message: string;
    data: Notification[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        limit: number;
    };
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<NotificationResponse>(`${apiBaseUrl}/api/notifications`);
            setNotifications(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        const socket = io(socketUrl, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to socket:", socket.id);
        });

        // Nhận thông báo mới
        socket.on("notify", (notification: Notification) => {
            console.log("New notification received:", notification);
            setNotifications(prev => [notification, ...prev]);
        });

        // Xóa thông báo
        socket.on("deleteNotify", (id: string) => {
            console.log("Notification deleted with ID:", id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        });

        // Đánh dấu đã đọc
        socket.on("markAsRead", ({ id }: { id: string }) => {
            console.log("Notification marked as read with ID:", id);
            setNotifications(prev =>
                prev.map(n =>
                    n._id === id ? { ...n, status: "read" } : n
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => n.status === "unread").length;

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead: async (id: string) => {
            try {
                await axios.patch(`${apiBaseUrl}/api/notifications/${id}/read`);
                socketRef.current?.emit("markAsRead", { id });

                setNotifications(prev =>
                    prev.map(n => (n._id === id ? { ...n, status: "read" } : n))
                );
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        },
        deleteNotification: async (id: string) => {
            try {
                await axios.delete(`${apiBaseUrl}/api/notifications/${id}`);
                socketRef.current?.emit("deleteNotify", id);

                setNotifications(prev => prev.filter(n => n._id !== id));
            } catch (err) {
                console.error("Failed to delete notification:", err);
            }
        },
    };

};
