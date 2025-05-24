"use client";

import React, { useMemo } from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbPage,
    BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { AlignLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button"
import { NotificationsDrawer } from "./NotificationsDrawer";
import { Howl } from "howler";

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

    const clickSound = useMemo(() => new Howl({
        src: ["/rung2.mp3"]
    }), []);

    const handleButtonClick = () => {
        clickSound.play();
        toggleSidebar();
    };

    return (
        <header className="flex justify-between items-center h-[60px] px-5 border-b bg-white sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Button className="lg:hidden w-8 h-8" variant="outline" size="icon" onClick={handleButtonClick}>
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
            <NotificationsDrawer />
        </header>
    );
}
