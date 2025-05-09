"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Notification {
    _id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    status: string;
}

const socketUrl = "https://api.wedly.info";
const socket: Socket = io(socketUrl);

const randomMessages: Omit<Notification, "_id" | "status">[] = [
    { message: "Thông báo thông thường", type: "info" },
    { message: "Thông báo thành công", type: "success" },
    { message: "Thông báo cảnh báo", type: "warning" },
    { message: "Thông báo lỗi", type: "error" },
];

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

const NotificationList: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();

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

    const sendNotification = async () => {
        const randomNotification = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const res = await fetch("https://api.wedly.info/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(randomNotification),
        });

        const newNotification: Notification = await res.json();

        // Cập nhật danh sách nếu server không emit lại notify
        setNotifications((prev) => [...prev, newNotification]);
    };

    const deleteNotification = async (id: string) => {
        const res = await fetch(`https://api.wedly.info/api/notifications/${id}`, { method: "DELETE" });
        const data = await res.json();

        // Cập nhật danh sách nếu server không emit lại deleteNotify
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-600">
                Fastify + Socket.IO (React + TS)
            </h1>

            <div className="flex justify-center mb-5">
                <button
                    onClick={sendNotification}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow text-base sm:text-lg"
                >
                    Gửi thông báo
                </button>
            </div>

            <ul className="space-y-3">
                {notifications.map((n) => (
                    <li
                        key={n._id}
                        className={`${getNotificationClass(n.type)} flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded shadow border gap-2`}
                    >
                        <span>
                            <strong>{n.type.toUpperCase()}</strong>: {n.message}{" "}
                            <em className="text-xs text-gray-600 ml-1">({n.status})</em>
                        </span>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm self-end sm:self-auto"
                            onClick={() => deleteNotification(n._id)}
                        >
                            Xóa
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
