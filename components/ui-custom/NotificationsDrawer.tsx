"use client";

import * as React from "react";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, EllipsisVertical, List, Mail, Check, Eye, Pencil, Trash2 } from "lucide-react";
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

export function NotificationsDrawer() {
    const { notifications, unreadCount, loading, error, markAsRead, deleteNotification, total, readCount } = useNotification();
    const [activeTab, setActiveTab] = React.useState<string>('all');
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

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
                    {/* <Bell strokeWidth={1.5} /> */}
                    <svg aria-hidden="true" role="img" className="iconify iconify--solar MuiBox-root css-0" width="18px" height="18px" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25A7.75 7.75 0 0 0 4.25 9v.704a3.53 3.53 0 0 1-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35q1.133.309 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a29 29 0 0 0 2.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 0 1-.593-1.958V9A7.75 7.75 0 0 0 12 1.25m3.376 18.287a28.5 28.5 0 0 1-6.753 0c.711 1.021 1.948 1.713 3.377 1.713s2.665-.692 3.376-1.713M5.75 9a6.25 6.25 0 1 1 12.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 0 1-1.15 3.071a26.96 26.96 0 0 1-14.187 0a2.02 2.02 0 0 1-1.15-3.07l1.15-1.724a5.03 5.03 0 0 0 .844-2.79z" clip-rule="evenodd"></path></svg>
                    {unreadCount > 0 && (
                        <span className="absolute top-[-2px] right-[-3px] bg-rose-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
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
                                <TabsTrigger className="px-2 py-2 flex items-center gap-1.5" value="all">
                                    <List className="w-4 h-4" />
                                    Tất cả
                                    <div className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">{total}</div>
                                </TabsTrigger>
                                <TabsTrigger className="px-2 py-2 flex items-center gap-1.5" value="unread">
                                    <Mail className="w-4 h-4" />
                                    Chưa đọc
                                    <div className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">{unreadCount}</div>
                                </TabsTrigger>
                                <TabsTrigger className="px-2 py-2 flex items-center gap-1.5" value="read">
                                    <CheckCircle className="w-4 h-4" />
                                    Đã đọc
                                    <div className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">{readCount}</div>
                                </TabsTrigger>
                            </div>

                            {/* <Popover>
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
                                                <CommandItem className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    Xem
                                                </CommandItem>
                                                <CommandItem className="flex items-center gap-2">
                                                    <Pencil className="w-4 h-4" />
                                                    Sửa
                                                </CommandItem>
                                                <CommandItem className="flex items-center gap-2 text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover> */}
                        </TabsList>

                        <div ref={scrollRef} className="h-[calc(100dvh-120px-50px)] overflow-auto">
                            <TabsContent className="mt-0 pb-8" value={activeTab}>
                                <div className="px-5 py-4 flex flex-col gap-2.5">
                                    {loading && <p>Đang tải thông báo...</p>}
                                    {!loading && filteredNotifications.length === 0 && <p>Không có thông báo nào.</p>}
                                    {!loading && filteredNotifications.length > 0 && filteredNotifications.map((noti) => (
                                        <div
                                            key={noti._id}
                                            className={`relative flex items-center justify-between py-2.5 px-3 rounded-md shadow-sm border cursor-pointer transition-all ${noti.status === "unread"
                                                ? "border-r-primary bg-sky-50"
                                                : "border-gray-200"
                                                }`}
                                            onClick={() =>
                                                noti.status === "unread" && markAsRead(noti._id)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shrink-0">
                                                    {noti.type === "info" && <Info size={19} className="text-blue-500" />}
                                                    {noti.type === "success" && <CheckCircle size={19} className="text-green-500" />}
                                                    {noti.type === "warning" && <AlertTriangle size={19} className="text-yellow-500" />}
                                                    {noti.type === "error" && <XCircle size={19} className="text-red-500" />}
                                                </div>
                                                <div>
                                                    <div
                                                        className="font-semibold text-sm"
                                                        dangerouslySetInnerHTML={{ __html: noti.message }}
                                                    />
                                                    <p className="text-sm text-gray-500 mt-0.5 text-[12px]">
                                                        {moment(noti.createdAt).fromNow()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="icon" className="min-w-8 min-h-8 p-0 ml-2.5" onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(noti._id)
                                            }}>
                                                <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                                            </Button>
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