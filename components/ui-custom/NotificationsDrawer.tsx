"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Bell, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Notification {
    _id: string;
    title: string;
    description: string;
    time: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
}

const socketUrl = "https://api.wedly.info";
let socket: Socket;

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

            console.log("check thông báo", data);

            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-9 h-9" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm h-dvh overflow-auto">
                    <DrawerHeader>
                        <DrawerTitle>Notifications</DrawerTitle>
                        <DrawerDescription>
                            {notifications.length} new notifications
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-4 p-4 max-h-[60vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No notifications found.
                            </p>
                        ) : (
                            notifications.map((note) => (
                                <Alert key={note._id} className="border">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>{note.type}</AlertTitle>
                                    <AlertDescription>
                                        <div>{note.message}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {note.time}
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ))
                        )}
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
