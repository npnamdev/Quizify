"use client";

import * as React from "react";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, EllipsisVertical, List, Mail, Check, Eye, Pencil, Trash2 } from "lucide-react";

export function NotificationsDrawer() {
    const { notifications, unreadCount, loading, error, markAsRead, deleteNotification } = useNotification();
    const [activeTab, setActiveTab] = React.useState<string>('all');

    // Log the active tab whenever it changes
    React.useEffect(() => {
        console.log(`Active tab changed to: ${activeTab}`);
    }, [activeTab]);

    // Lọc thông báo theo trạng thái
    const filteredNotifications = notifications.filter((noti) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return noti.status === 'unread';
        if (activeTab === 'read') return noti.status === 'read';
        return false;
    });

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
                <div className="mx-auto w-full max-w-[100%] h-[calc(100dvh-140px)]">
                    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full pt-2.5">
                        <TabsList className="w-full h-[50px] flex justify-between px-5 gap-2">
                            <div className="flex gap-1">
                                <TabsTrigger className="px-2.5 py-2 flex items-center gap-1.5" value="all">
                                    <List className="w-4 h-4" />Tất cả
                                </TabsTrigger>
                                <TabsTrigger className="px-2.5 py-2 flex items-center gap-1.5" value="unread">
                                    <Mail className="w-4 h-4" />Chưa đọc
                                </TabsTrigger>
                                <TabsTrigger className="px-2.5 py-2 flex items-center gap-1.5" value="read">
                                    <CheckCircle className="w-4 h-4" />Đã đọc
                                </TabsTrigger>
                            </div>
                        </TabsList>

                        <div className="h-[calc(100dvh-120px-50px)] overflow-auto">
                            <TabsContent className="mt-0 pb-8" value={activeTab}>
                                <div className="px-5 py-4 flex flex-col gap-2.5">
                                    {/* Loading state */}
                                    {loading && <p>Đang tải thông báo...</p>}

                                    {/* No notifications */}
                                    {!loading && filteredNotifications.length === 0 && <p>Không có thông báo nào.</p>}

                                    {/* Render notifications */}
                                    {!loading && filteredNotifications.length > 0 && filteredNotifications.map((noti) => (
                                        <div
                                            key={noti._id}
                                            className={`relative flex items-center gap-3 py-2.5 px-3 rounded-md shadow-sm border cursor-pointer transition-all ${noti.status === "unread"
                                                ? "border-r-8 border-r-primary bg-blue-50"
                                                : "border-gray-200"
                                                }`}
                                            onClick={() =>
                                                noti.status === "unread" && markAsRead(noti._id)
                                            }
                                        >
                                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 shrink-0">
                                                <Info size={18} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{noti.message}</p>
                                                <p className="text-sm text-gray-500 mt-0.5 text-[12px]">
                                                    {noti.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DrawerContent>
        </Drawer>
    );
}