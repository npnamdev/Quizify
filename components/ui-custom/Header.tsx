'use client';

import Image from "next/image";
import Link from "next/link";
import { Globe, Moon, ShoppingBag, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    if (pathname.startsWith('/manage')) {
        return null;
    }

    const menus = [
        { label: "Trang chủ", href: "/" },
        { label: "Khóa học", href: "/courses" },
        { label: "Blog", href: "/blog" },
        { label: "Liên hệ", href: "/contact" },
        { label: "Hỗ trợ", href: "/support" },
    ];

    return (
        <header className="hidden lg:block select-none sticky top-0 z-50 bg-white/95 dark:bg-[#0D1824] dark:border-b backdrop-blur shadow-[0px_4px_4px_rgba(93,90,90,0.15)]">
            <nav className="container h-[64px] flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Image
                            src={'/logo.svg'} alt="Next.js Logo"
                            width={140}
                            height={35}
                            priority
                            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                        />
                    </Link>
                    <ul className="flex gap-8 font-semibold ml-5">
                        {menus.map((item, index) => (
                            <li key={index}>
                                <Link
                                    className={`text-black dark:text-white hover:text-primary transition-all duration-75 ${pathname === item.href ? 'text-primary' : ''}`}
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center">
                    <div className="mx-3 flex items-center gap-4 h-[36px]">
                        {theme === 'dark' ? (

                            <Sun
                                onClick={() => setTheme("light")}
                                size={18}
                                strokeWidth={1.5}
                                className="hover:text-primary cursor-pointer text-black dark:text-white"
                            />
                        ) : (
                            <Moon
                                onClick={() => setTheme("dark")}
                                size={18}
                                strokeWidth={1.5}
                                className="hover:text-primary cursor-pointer text-black dark:text-white"
                            />
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Globe size={18} strokeWidth={1.5} className="hover:text-primary cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="font-semibold text-[13px]">
                                    <Image
                                        src="https://res.cloudinary.com/dijvnrdmc/image/upload/v1721809899/FlagUs4x3.svg" alt="Next.js Logo"
                                        width={20}
                                        height={20}
                                        priority
                                        className="rounded-[2px]"
                                    />
                                    <span className="ml-2">English</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-semibold text-[13px]">
                                    <Image
                                        src="https://res.cloudinary.com/dijvnrdmc/image/upload/v1721809900/FlagVn4x3.svg" alt="Next.js Logo"
                                        width={20}
                                        height={20}
                                        priority
                                        className="rounded-[2px]"
                                    />
                                    <span className="ml-2">Vietnamese</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button className="mx-2.5 font-semibold rounded text-[13.5px]" variant="secondary">
                        <Link href="/manage" className="">Kích hoạt</Link>
                    </Button>
                    {/* <Link href="/cart" className="relative ml-4">
                        <span className="w-[16px] h-[16px] flex justify-center items-center bg-yellow-400 text-white absolute top-[-10px] right-[-10px] rounded-full text-[10px] font-semibold">5</span>
                        <ShoppingBag size={19} strokeWidth={1.5} className="hover:text-primary cursor-pointer text-black dark:text-white" />
                    </Link> */}
                </div>
            </nav>
        </header>
    );
};

export default Header;