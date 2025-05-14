"use client";

import * as React from "react";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, EllipsisVertical, List, Mail, Check, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
import { useRef, useState } from "react";

export function NotificationsDrawer() {
    const {
        notifications,
        loading,
        activeTab,
        setActiveTab,
        unreadCount,
        markAsRead,
        formatRelativeTime,
    } = useNotificationSystem();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

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

    const renderNotifications = () => {
        if (loading) {
            return (
                <div className="px-5 py-4 space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (notifications.length === 0) {
            return <p className="text-sm text-center text-gray-500 py-6">Không có thông báo nào.</p>;
        }

        return (
            <div className="px-5 py-4 flex flex-col gap-2.5">
                {notifications.map((noti) => (
                    <div
                        key={noti._id}
                        className={`relative flex items-center gap-3 py-2.5 px-3 rounded-md shadow-sm border cursor-pointer transition-all ${noti.status === "unread"
                            ? "border-r-8 border-r-primary"
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

    const handleAction = (action: string) => {
        setOpen(false);
        switch (action) {
            case "view":
                console.log("Xem chi tiết");
                break;
            case "edit":
                console.log("Chỉnh sửa");
                break;
            case "delete":
                console.log("Xóa mục");
                break;
            default:
                break;
        }
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
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                                        <EllipsisVertical strokeWidth={1.5} className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" align="end" className="w-30 p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandEmpty>Không tìm thấy hành động.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem className="flex items-center gap-2" onSelect={() => handleAction("view")}>
                                                    <Eye className="w-4 h-4" />
                                                    Xem
                                                </CommandItem>
                                                <CommandItem className="flex items-center gap-2" onSelect={() => handleAction("edit")}>
                                                    <Pencil className="w-4 h-4" />
                                                    Sửa
                                                </CommandItem>
                                                <CommandItem className="flex items-center gap-2 text-red-500" onSelect={() => handleAction("delete")}>
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </TabsList>

                        <div ref={scrollRef} className="h-[calc(100dvh-120px-50px)] overflow-auto">
                            <TabsContent className="mt-0 pb-3" value={activeTab}>
                                {renderNotifications()}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DrawerContent>
        </Drawer>
    );
}