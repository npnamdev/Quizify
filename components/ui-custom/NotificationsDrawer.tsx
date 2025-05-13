"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import moment from "moment";
import "moment/locale/vi";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

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

function formatRelativeTime(dateStr: string) {
    return moment(dateStr).fromNow();
}

export function NotificationsDrawer() {
    const socketRef = useRef<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        fetchNotifications();

        const socket = io(socketUrl, { transports: ["websocket"] });
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
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${socketUrl}/api/notifications`);
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

    const unreadCount = notifications.filter((n) => n.status === "unread").length;

    const getIconByType = (type: string) => {
        switch (type) {
            case "info":
                return <Info size={18} className="text-blue-500" />;
            case "success":
                return <CheckCircle size={18} className="text-green-500" />;
            case "warning":
                return <AlertTriangle size={18} className="text-yellow-500" />;
            case "error":
                return <XCircle size={18} className="text-red-500" />;
            default:
                return null;
        }
    };

    const renderNotifications = (filter: "all" | "read" | "unread") => {
        const filtered =
            filter === "all"
                ? notifications
                : notifications.filter((n) => n.status === filter);

        if (loading) {
            return <p className="text-sm text-center text-gray-500 py-6">Đang tải thông báo...</p>;
        }

        if (filtered.length === 0) {
            return <p className="text-sm text-center text-gray-500 py-6">Không có thông báo nào.</p>;
        }

        return (
            <div className="px-5 py-4 flex flex-col gap-2.5">
                {filtered.map((noti) => (
                    <div
                        key={noti._id}
                        className={`relative flex items-center gap-3 py-2.5 px-3 rounded-md shadow-sm border cursor-pointer transition-all ${noti.status === "unread"
                                ? "border-r-8 border-r-red-500"
                                : "border-gray-200"
                            }`}
                        onClick={() =>
                            noti.status === "unread" && markAsRead(noti._id)
                        }
                    >
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 shrink-0">
                            {getIconByType(noti.type)}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{noti.message}</p>
                            <p className="text-sm text-gray-500 mt-0.5 text-[12px]">
                                {formatRelativeTime(noti.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-9 h-9 relative" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                    {unreadCount > 0 && (
                        <span className="absolute top-[-2px] right-[-3px] bg-red-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-[100%] h-[calc(100dvh-100px)] overflow-auto">
                    <DrawerHeader className="h-[50px] flex items-center justify-center border-b text-md font-bold">
                        <DrawerTitle>Thông báo</DrawerTitle>
                    </DrawerHeader>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="flex justify-center px-5 pt-3 gap-2">
                            <TabsTrigger value="all">Tất cả</TabsTrigger>
                            <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                            <TabsTrigger value="read">Đã đọc</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">{renderNotifications("all")}</TabsContent>
                        <TabsContent value="unread">{renderNotifications("unread")}</TabsContent>
                        <TabsContent value="read">{renderNotifications("read")}</TabsContent>
                    </Tabs>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
