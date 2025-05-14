"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");
moment.updateLocale("vi", {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: "vài giây",
        ss: "%d giây",
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm",
    },
});

interface Notification {
    _id: string;
    title?: string;
    description?: string;
    time: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    createdAt: string;
    status: "read" | "unread";
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

const socketUrl = process.env.NEXT_PUBLIC_API_URL!;

export function useNotificationSystem() {
    const socketRef = useRef<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [, forceUpdate] = useState(0);
    const [activeTab, setActiveTab] = useState<"all" | "read" | "unread">("all");

    const formatRelativeTime = (dateStr: string) => {
        return moment(dateStr).fromNow();
    };

    const fetchNotifications = async (status: "all" | "read" | "unread") => {
        try {
            setLoading(true);
            const query = status === "all" ? "" : `?status=${status}`;
            const res = await fetch(`${socketUrl}/api/notifications${query}`);
            const result: NotificationResponse = await res.json();
            setNotifications(result.data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`${socketUrl}/api/notifications/${id}/read`, {
                method: "PATCH",
            });
            const result = await res.json();
            if (result.status === "success") {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n._id === id ? { ...n, status: "read" } : n
                    )
                );
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    useEffect(() => {
        fetchNotifications(activeTab);

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
            setNotifications((prev) => [notification, ...prev]);
        });

        socket.on("deleteNotify", (id: string) => {
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        });

        socket.on("markAsRead", ({ id }: { id: string }) => {
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, status: "read" } : n
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((prev) => prev + 1);
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchNotifications(activeTab);
    }, [activeTab]);

    const unreadCount = notifications.filter((n) => n.status === "unread").length;

    return {
        notifications,
        loading,
        activeTab,
        setActiveTab,
        unreadCount,
        markAsRead,
        formatRelativeTime,
    };
}