"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { io, Socket } from "socket.io-client";

const socketUrl = "https://api.wedly.info";
const socket: Socket = io(socketUrl);

interface Notification {
    _id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    status: string;
}

const getNotificationClass = (type: Notification["type"]): string => {
    switch (type) {
        case "info":
            return "bg-blue-100 text-blue-800 border-blue-300";
        case "success":
            return "bg-green-100 text-green-800 border-green-300";
        case "warning":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "error":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
    }
};

export function NotificationsDrawer() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        // Fetch notifications on component mount
        fetchNotifications();

        // Listen for real-time notifications
        socket.on("connect", () => {
            console.log("Connected to server, id:", socket.id);
        });

        socket.on("notify", (notification: Notification) => {
            setNotifications((prev) => [...prev, notification]);
        });

        socket.on("deleteNotify", (id: string) => {
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchNotifications = async () => {
        const res = await fetch("https://api.wedly.info/api/notifications");
        const data: Notification[] = await res.json();
        setNotifications(data);
    };

    const deleteNotification = async (id: string) => {
        const res = await fetch(`https://api.wedly.info/api/notifications/${id}`, { method: "DELETE" });
        const data = await res.json();
        console.log("Notification deleted:", data);
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-9 h-9" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Notifications</DrawerTitle>
                        <DrawerDescription>{notifications.length} new notifications</DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-4 p-4">
                        {notifications.map((note) => (
                            <div
                                key={note._id}
                                className={`${getNotificationClass(note.type)} rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow`}
                            >
                                <div className="font-medium text-lg text-gray-900 p-3">{note.type.toUpperCase()}</div>
                                <div className="text-sm text-gray-700 p-3">{note.message}</div>
                                <div className="text-xs text-gray-500 p-3">{note.status}</div>
                                <div className="p-3">
                                    <button
                                        onClick={() => deleteNotification(note._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
