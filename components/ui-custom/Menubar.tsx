"use client";

import * as React from "react";
import { CircleHelp, BadgeCheck, Bell, BookOpen, UsersRound, ChevronRight, ChevronsUpDown, ShoppingCart, CreditCard, Folder, Forward, SlidersVertical, ChartBarDecreasing, LogOut, GitBranch, MoreHorizontal, SwatchBook, Package, Settings, Sparkles, LayoutGrid, Trash2, Palette, GalleryVerticalEnd, AudioWaveform, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"
import { toast } from 'sonner';

export default function Menubar() {
    const { setOpenMobile } = useSidebar();
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);


    const data = {
        user: { name: "Phương Nam", email: "root@domain.com", avatar: "https://lineone.piniastudio.com/images/avatar/avatar-6.jpg" },
        navMain: [
            {
                title: t('statisticsReports'),
                url: "/manage",
                icon: LayoutGrid,
            },
            {
                title: t('userManagement'),
                url: "#",
                icon: UsersRound,
                items: [
                    { title: t('userAccounts'), url: "/manage/user-accounts" },
                    { title: t('rolesPermissions'), url: "/manage/roles-permissions" },
                ],
            },
            {
                title: t('courseManagement'),
                url: "#",
                icon: BookOpen,
                items: [
                    { title: t('courseList'), url: "/manage/courses" },
                    { title: t('courseCategories'), url: "/manage/categories" },
                    { title: t('courseTags'), url: "/manage/tags" },
                    { title: t('activationCodes'), url: "/manage/activate-course" },
                ],
            },
            {
                title: t('revenueManagement'),
                url: "#",
                icon: ShoppingCart,
                items: [
                    { title: t('orderList'), url: "/manage/order-list" },
                    { title: t('codManagement'), url: "/manage/cod-management" },
                    { title: t('processCodOrders'), url: "/manage/process-cod-orders" },
                ],
            },
            {
                title: t('marketingCampaigns'),
                url: "#",
                icon: ChartBarDecreasing,
                items: [
                    { title: t('promoCodes'), url: "/manage/promo-codes" },
                    { title: t('emailCampaigns'), url: "/manage/email-marketing" },
                    { title: t('popUpWindows'), url: "/manage/popups" },
                ],
            },
            {
                title: t('affiliateMarketing'),
                url: "#",
                icon: GitBranch,
                items: [
                    { title: t('affiliateList'), url: "/manage/affiliate-list" },
                    { title: t('affiliatePayments'), url: "/manage/affiliate-payments" },
                ],
            },
            {
                title: t('uiCustomization'),
                url: "#",
                icon: Palette,
                items: [
                    { title: t('header'), url: "/customize/header" },
                    { title: t('heroSection'), url: "/customize/hero" },
                    { title: t('courseCategories'), url: "/customize/course-categories" },
                    { title: t('courseList'), url: "/customize/course-list" },
                    { title: t('about'), url: "/customize/about" },
                    { title: t('testimonials'), url: "/customize/testimonials" },
                    { title: t('partners'), url: "/customize/partners" },
                    { title: t('footer'), url: "/customize/footer" },
                ],
            },
            {
                title: t('libraryManagement'),
                url: "/manage/liblarys",
                icon: SwatchBook,
            },
        ],
        settings: [
            { name: t('displaySettings'), url: "/manage/display-settings", icon: SlidersVertical },
            { name: t('systemSettings'), url: "/manage/system-settings", icon: Settings },
            { name: t('websiteResources'), url: "/manage/website-resources", icon: Package },
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

    const handleLogout = () => {
        document.body.style.pointerEvents = 'auto';
        router.replace('/sign-in', { locale: currentLocale });
        localStorage.removeItem('accessToken');
        toast.success("Đăng xuất thành công");
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="px-6 border-b bg-white flex justify-center h-[60px]">
                <h1 className="text-[27px] font-black text-primary">Learnify</h1>
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
                        <DropdownMenu>
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
                                            {data.user.name}
                                        </span>
                                        <span className="truncate text-xs text-black">
                                            {data.user.email}
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
                                                {data.user.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {data.user.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleLogout()}>
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