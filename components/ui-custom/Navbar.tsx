"use client";

import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    const isHidden =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/unauthorized" ||
        pathname === "/device" ||
        pathname.startsWith("/manage");

    if (isHidden) return null;

    return (
        <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <span className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer">
                        MyApp
                    </span>
                </Link>
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-700">
                                Welcome, <span className="font-medium">{user?.fullName}</span>
                            </p>
                            {user?.role?.name === "admin" && (
                                <Link href="/manage">
                                    <Button variant="secondary">
                                        Manage
                                    </Button>
                                </Link>
                            )}
                            <Button variant="destructive" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button>Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;