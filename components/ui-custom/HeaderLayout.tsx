"use client";

import React from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbPage,
    BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { AlignLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const notifications = [
    {
        id: 1,
        title: "New Message",
        description: "You have received a new message from John.",
        time: "2 minutes ago",
    },
    {
        id: 2,
        title: "System Alert",
        description: "System maintenance scheduled at 11:00 PM.",
        time: "1 hour ago",
    },
    {
        id: 3,
        title: "New Comment",
        description: "Anna commented on your post.",
        time: "3 hours ago",
    },
]

const segmentLabels: Record<string, string> = {
    manage: "Quản lý", courses: "Danh sách khóa học", categories: "Danh mục khóa học",
    tags: "Thẻ khóa học", "activate-course": "Kích hoạt khóa học", "user-accounts": "Tài khoản người dùng",
    "account-groups": "Nhóm tài khoản", "roles-permissions": "Vai trò & phân quyền",
    "promo-codes": "Mã giảm giá", "email-marketing": "Chiến dịch email",
    popups: "Cửa sổ quảng cáo", liblarys: "Quản lý thư viện"
};

const formatSegment = (segment: string) =>
    segmentLabels[segment] || segment.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

export default function HeaderLayout() {
    const { toggleSidebar } = useSidebar();
    const pathSegments = usePathname().split("/").filter(Boolean).filter(s => !["vi", "en"].includes(s));

    return (
        <header className="flex justify-between items-center h-[60px] px-5 border-b bg-white sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Button className="lg:hidden w-8 h-8" variant="outline" size="icon" onClick={toggleSidebar}>
                    <AlignLeft strokeWidth={1.5} />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-4 md:hidden" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((seg, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <BreadcrumbSeparator />}
                                <BreadcrumbItem>
                                    {idx === pathSegments.length - 1 ? (
                                        <BreadcrumbPage>{formatSegment(seg)}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={`/${pathSegments.slice(0, idx + 1).join("/")}`}>
                                            {formatSegment(seg)}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

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
                            <DrawerDescription>You have {notifications.length} new notifications.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 space-y-4">
                            {notifications.map((note) => (
                                <div key={note.id} className="rounded-lg border p-4 shadow-sm">
                                    <div className="font-medium">{note.title}</div>
                                    <div className="text-sm text-muted-foreground">{note.description}</div>
                                    <div className="text-xs text-gray-500 mt-1">{note.time}</div>
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
        </header>
    );
}
