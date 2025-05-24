"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { Howl } from "howler";

const socketUrl = process.env.NEXT_PUBLIC_API_URL!;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!;

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
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

    const notificationSound = useRef(
        new Howl({
            src: ['/bell.mp3'],
            volume: 0.5,
            html5: true,
        })
    );

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<NotificationResponse>(`${apiBaseUrl}/api/notifications?page=1&limit=100`);
            setNotifications(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await axios.patch(`${apiBaseUrl}/api/notifications/${id}/read`);
            socketRef.current?.emit("markAsRead", { id });

            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, status: "read" } : n))
            );
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const deleteNotification = async (id: string) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá thông báo này không?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${apiBaseUrl}/api/notifications/${id}`);
            socketRef.current?.emit("deleteNotify", id);

            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

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

        socket.on("notify", (notification: Notification) => {
            console.log("New notification received:", notification);
            setNotifications(prev => [notification, ...prev]);

            // Phát âm thanh khi có thông báo mới
            notificationSound.current.play();
        });

        socket.on("deleteNotify", (id: string) => {
            console.log("Notification deleted with ID:", id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        });

        socket.on("markAsRead", ({ id }: { id: string }) => {
            console.log("Notification marked as read with ID:", id);
            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, status: "read" } : n))
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => n.status === "unread").length;
    const total = notifications.length;
    const readCount = notifications.filter(n => n.status === "read").length;

    return { notifications, unreadCount, total, readCount, loading, error, markAsRead, deleteNotification };
};
