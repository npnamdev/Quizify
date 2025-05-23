"use client";

import React, { useState } from "react";
import { CircleHelp, BadgeCheck, Bell, BookOpen, UsersRound, ChevronRight, ChevronsUpDown, ShoppingCart, CreditCard, Folder, Forward, SlidersVertical, ChartBarDecreasing, LogOut, GitBranch, MoreHorizontal, SwatchBook, Package, Settings, Sparkles, LayoutGrid, Trash2, Palette, GalleryVerticalEnd, AudioWaveform, Command, Home, House } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthProvider";

export default function Menubar() {
    const router = useRouter();
    const { setOpenMobile } = useSidebar();
    const { logout, user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

    const handleLogout = () => {
        setDropdownOpen(false);

        setTimeout(async () => {
            await logout();
            router.push("/");
        }, 500);
    };

    const handleRedirectHomePage = () => {
        setDropdownOpen(false);
        setTimeout(async () => {
            router.push("/");
        }, 500);
    };


    const data = {
        user: {
            name: "Phương Nam",
            email: "root@domain.com",
            avatar: "https://lineone.piniastudio.com/images/avatar/avatar-6.jpg"
        },
        navMain: [
            {
                title: "Thống kê & Báo cáo",
                url: "/manage",
                icon: LayoutGrid,
            },
            {
                title: "Quản lý người dùng",
                url: "#",
                icon: UsersRound,
                items: [
                    { title: "Tài khoản người dùng", url: "/manage/user-accounts" },
                    { title: "Vai trò & Phân quyền", url: "/manage/roles-permissions" },
                ],
            },
            {
                title: "Quản lý khóa học",
                url: "#",
                icon: BookOpen,
                items: [
                    { title: "Danh sách khóa học", url: "/manage/courses" },
                    { title: "Danh mục khóa học", url: "/manage/categories" },
                    { title: "Thẻ khóa học", url: "/manage/tags" },
                    { title: "Mã kích hoạt", url: "/manage/activate-course" },
                ],
            },
            // {
            //     title: "Quản lý doanh thu",
            //     url: "#",
            //     icon: ShoppingCart,
            //     items: [
            //         { title: "Danh sách đơn hàng", url: "/manage/order-list" },
            //         { title: "Quản lý COD", url: "/manage/cod-management" },
            //         { title: "Xử lý đơn hàng COD", url: "/manage/process-cod-orders" },
            //     ],
            // },
            {
                title: "Quản lý thư viện",
                url: "#",
                icon: SwatchBook,
                items: [
                    { title: "Hình ảnh", url: "/manage/images" },
                    { title: "Video", url: "/manage/videos" },
                    { title: "Audio", url: "/manage/audios" },
                    { title: "Tài liệu", url: "/manage/files" },
                ],
            }
        ],
        settings: [
            { name: "Cài đặt hiển thị", url: "/manage/display-settings", icon: SlidersVertical },
            { name: "Cài đặt hệ thống", url: "/manage/system-settings", icon: Settings },
        ],
    };


    React.useEffect(() => {
        data.navMain.forEach((item) => {
            if (item.items) {
                const matchingItem = item.items.find((subItem) => pathname === subItem.url);
                if (matchingItem) {
                    setOpenSubmenu(item.title);
                }
            }
        });
    }, [pathname]);

    const handleToggle = (title: string) => {
        setOpenSubmenu(prev => (prev === title ? null : title));
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="px-6 border-b bg-white flex justify-center h-[60px]">
                <Link href="/">
                    <h1 className="text-[27px] font-black text-primary">Learnify</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-2 bg-white gap-0">
                <SidebarGroup>
                    <SidebarGroupLabel className="font-bold uppercase mb-1">Overview</SidebarGroupLabel>
                    <SidebarMenu className="gap-1.5">
                        {data.navMain.map((item) => (
                            item.items && item.items.length > 0 ? (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    open={openSubmenu === item.title}
                                    onOpenChange={() => handleToggle(item.title)}
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title} className={`text-black ${pathname == item.url ? 'bg-gray-100' : ''}`}>
                                                {item.icon && <item.icon color="#2a2727" strokeWidth={1.75} />}
                                                <span>{item.title}</span>
                                                <ChevronRight className={`ml-auto transition-transform duration-150 ${openSubmenu === item.title ? 'rotate-90' : ''}`} />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton onClick={() => setOpenMobile(false)} asChild className={`text-black ${pathname == subItem.url ? 'bg-gray-100' : ''}`}>
                                                            <Link href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton onClick={() => setOpenMobile(false)} asChild className={`text-black ${pathname == item.url ? 'bg-gray-100' : ''}`}>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon color="#2a2727" strokeWidth={1.75} />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel className="font-bold uppercase mb-1">Settings</SidebarGroupLabel>
                    <SidebarMenu className="gap-1.5">
                        {data.settings.map((item) => (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton asChild className="text-black">
                                    <Link href={item.url}>
                                        <item.icon color="#2a2727" strokeWidth={1.75} />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction showOnHover>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-48 rounded-lg"
                                        side="bottom"
                                        align="end"
                                    >
                                        <DropdownMenuItem>
                                            <Folder className="text-muted-foreground" />
                                            <span>View Project</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Forward className="text-muted-foreground" />
                                            <span>Share Project</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Trash2 className="text-muted-foreground" />
                                            <span>Delete Project</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="px-3.5 bg-white border-t">
                <SidebarMenu className="">
                    <SidebarMenuItem>
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={data.user.avatar}
                                            alt={data.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold text-black">
                                            {user?.fullName}
                                        </span>
                                        <span className="truncate text-xs text-black">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={data.user.avatar}
                                                alt={data.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                PN
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {user?.fullName}
                                            </span>
                                            <span className="truncate text-xs">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleRedirectHomePage}>
                                    <House />
                                  Quay lại trang chủ
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut />
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}