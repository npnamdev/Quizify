"use client";

import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    const isHidden =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password" ||
        pathname === "/verify-email" ||
        pathname === "/verify-email-info" ||
        pathname === "/unauthorized" ||
        pathname === "/device" ||
        pathname.startsWith("/manage");

    if (isHidden) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const fallbackImage = user?.fullName
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.fullName
        )}&background=random`
        : "";

    return (
        <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition"
                >
                    MyApp
                </Link>

                <div className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="flex items-center space-x-3 cursor-pointer">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={user?.avatarUrl || fallbackImage}
                                                alt={user?.fullName || "User"}
                                            />
                                            <AvatarFallback>
                                                {getInitials(user?.fullName || "U")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-medium text-gray-700 hidden md:block">
                                            {user?.fullName}
                                        </p>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 p-2 space-y-2">
                                    {user?.role?.name === "admin" && (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                window.location.href = "/manage";
                                            }}
                                        >
                                            Trang quản trị
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={logout}
                                    >
                                        Đăng xuất
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button size="sm">Đăng nhập</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" variant="outline">
                                    Đăng ký
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
