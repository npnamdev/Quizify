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
    { message: "Khóa học 'Lập trình JavaScript cơ bản' đã được mở thành công.", type: "success" },
    { message: "Khóa học 'Dự án React cuối khóa' đã được hoàn thành và gửi kết quả.", type: "success" },
    { message: "Khóa học 'Node.js nâng cao' sắp hết hạn đăng ký. Đừng bỏ lỡ!", type: "warning" },
    { message: "Khóa học 'Thiết kế web với Figma' chưa đủ học viên để mở lớp.", type: "warning" },
    { message: "Lỗi hệ thống: Không thể tải thông tin khóa học từ cơ sở dữ liệu.", type: "error" },
    { message: "Khóa học 'Lập trình iOS' đã gặp sự cố trong quá trình cập nhật thông tin.", type: "error" },
    { message: "Học viên 'Nguyễn Văn A' đã đăng ký khóa học 'Lập trình Frontend'.", type: "success" },
    { message: "Học viên 'Trần Thị B' đã hoàn thành bài kiểm tra cuối khóa 'JavaScript cơ bản'.", type: "success" },
    { message: "Học viên 'Nguyễn Thị C' đã bỏ qua bài kiểm tra trong khóa học 'React'.", type: "warning" },
    { message: "Học viên 'Lê Minh D' chưa xác nhận email để hoàn tất đăng ký.", type: "warning" },
    { message: "Lỗi hệ thống: Không thể đăng ký học viên vào khóa học 'Dự án thực tế'.", type: "error" },
    { message: "Học viên 'Phạm Văn E' đã gặp lỗi trong quá trình thanh toán.", type: "error" },
    { message: "Thanh toán cho khóa học 'Lập trình Python' đã thành công.", type: "success" },
    { message: "Học viên 'Vũ Hoàng G' đã hoàn tất thanh toán khóa học 'Web Design'.", type: "success" },
    { message: "Có một giao dịch thanh toán chưa hoàn tất cho học viên 'Đặng Tuấn H'.", type: "warning" },
    { message: "Cảnh báo: Học viên 'Lê Minh K' đã hủy thanh toán cho khóa học 'React'.", type: "warning" },
    { message: "Lỗi thanh toán: Không thể xử lý thẻ tín dụng của học viên 'Bùi Minh T'.", type: "error" },
    { message: "Lỗi hệ thống: Giao dịch thanh toán cho khóa học 'Backend with Node.js' không thành công.", type: "error" },
    { message: "Hệ thống đã được nâng cấp thành công lên phiên bản mới nhất.", type: "info" },
    { message: "Dữ liệu hệ thống đã được sao lưu vào lúc 3:00 AM.", type: "info" },
    { message: "Lỗi hệ thống: Dịch vụ gửi email tạm thời không khả dụng.", type: "error" },
    { message: "Lỗi hệ thống: Máy chủ của chúng tôi đang gặp sự cố và sẽ sớm được khôi phục.", type: "error" },
    { message: "Cảnh báo khẩn cấp: Hệ thống phát hiện sự cố bảo mật nghiêm trọng và đang được xử lý.", type: "error" },
    { message: "Hệ thống đang bảo trì và sẽ trở lại trong vòng 30 phút.", type: "info" },
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

        console.log("res", res);

        setNotifications(data);
    };

    const sendNotification = async () => {
        const randomNotification = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const res = await fetch("https://api.wedly.info/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(randomNotification),
        });
        const data = await res.json();
        console.log("Notification created:", data);
    };

    const deleteNotification = async (id: string) => {
        const res = await fetch(`https://api.wedly.info/api/notifications/${id}`, { method: "DELETE" });
        const data = await res.json();
        console.log("Notification deleted:", data);
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
                        className={`${getNotificationClass(
                            n.type
                        )} flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded shadow border gap-2`}
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
