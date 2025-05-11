"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import clsx from "clsx";

import moment from "moment"
import "moment/locale/vi"

moment.locale("vi")

interface Notification {
    _id: string;
    title?: string;
    description?: string;
    time: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    status: "read" | "unread";
}

const socketUrl = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket;

function formatRelativeTime(dateStr: string) {
    return moment(dateStr).fromNow()
}

export function NotificationsDrawer() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();

        socket = io(socketUrl, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Connected to socket:", socket.id);
        });

        socket.on("notify", (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        socket.on("deleteNotify", (id: string) => {
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${socketUrl}/api/notifications`);
            const data: Notification[] = await res.json();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${socketUrl}/api/notifications/${id}/read`, {
                method: "PATCH",
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, status: "read" } : n
                )
            );
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const unreadCount = notifications.filter((n) => n.status === "unread").length;

    const getIconByType = (type: string) => {
        switch (type) {
            case "info":
                return <Info className="text-blue-500" />
            case "success":
                return <CheckCircle className="text-green-500" />
            case "warning":
                return <AlertTriangle className="text-yellow-500" />
            case "error":
                return <XCircle className="text-red-500" />
            default:
                return null
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-9 h-9 relative" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="border border-black">
                <div className="mx-auto w-full  max-w-[100%] h-[90%] overflow-auto">
                    <DrawerHeader className="h-[50px] flex items-center justify-center border-b text-md font-bold">
                        <DrawerTitle>Thông báo</DrawerTitle>
                    </DrawerHeader>

                    {/* <div className="space-y-4 p-4  overflow-y-auto border h-[calc(100%-120px)]">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No notifications found.
                            </p>
                        ) : (
                            notifications.map((note) => (
                                <div
                                    key={note._id}
                                    onClick={() =>
                                        note.status === "unread" && markAsRead(note._id)
                                    }
                                    className="cursor-pointer"
                                >
                                    <Alert
                                        className={clsx(
                                            "border",
                                            note.status === "unread"
                                                ? {
                                                    info: "border-blue-500 bg-blue-100",
                                                    success: "border-green-500 bg-green-100",
                                                    warning: "border-yellow-500 bg-yellow-100",
                                                    error: "border-red-500 bg-red-100",
                                                }[note.type]
                                                : "opacity-70"
                                        )}
                                    >

                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <AlertTitle className="capitalize">
                                                    {note.type}
                                                </AlertTitle>
                                                <AlertDescription>
                                                    <div>{note.message}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {note.time}
                                                    </div>
                                                </AlertDescription>
                                            </div>
                                            {note.status === "unread" && (
                                                <span className="mt-1 ml-2 w-2 h-2 bg-red-500 rounded-full shrink-0" />
                                            )}
                                        </div>
                                    </Alert>
                                </div>
                            ))
                        )}
                    </div> */}

                    <div className="h-[calc(100dvh-50px)] lg:h-[400px] w-full px-5 overflow-auto select-none py-4 flex flex-col gap-2.5">
                        {notifications.map((noti, index) => (
                            <div
                                key={index}
                                className="relative flex items-center gap-4 py-2.5 px-3 border rounded-md shadow-sm"
                                onClick={() =>
                                    noti.status === "unread" && markAsRead(noti._id)
                                }
                            >
                                {/* Dot if unread */}
                                {/* {!noti.isRead && (
                                <span className="absolute right-4 w-2.5 h-2.5 bg-red-500 rounded-full" />
                            )} */}
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shrink-0">
                                    {getIconByType(noti.type)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{noti.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">5 giờ trước</p>
                                    {/* <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(noti.date)}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <DrawerFooter className="h-[60px] flex items-center justify-center">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter> */}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
