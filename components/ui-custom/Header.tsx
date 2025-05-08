'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import Link from 'next/link';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Ẩn menu nếu đang ở trên những trang này
  const isHidden = pathname === "/login" || pathname === "/register" || pathname === "/unauthorized" || pathname.startsWith("/manage");

  if (isHidden) return null;

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-indigo-400">
            MyWebsite
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <Link href="/about" className="hover:text-indigo-400">About</Link>
          <Link href="/services" className="hover:text-indigo-400">Services</Link>
          <Link href="/contact" className="hover:text-indigo-400">Contact</Link>
          
          {/* Conditional rendering for logged-in users */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user?.role?.name === "admin" && (
                <Link href="/manage">
                  <Button variant="outline">Manage</Button>
                </Link>
              )}
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button using Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="text-2xl">
                ☰
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of the website.
                </SheetDescription>
              </SheetHeader>

              {/* Mobile Menu Links */}
              <nav className="space-y-4 py-4">
                <Link href="/" className="block hover:text-indigo-400">Home</Link>
                <Link href="/about" className="block hover:text-indigo-400">About</Link>
                <Link href="/services" className="block hover:text-indigo-400">Services</Link>
                <Link href="/contact" className="block hover:text-indigo-400">Contact</Link>

                {/* Mobile menu login/register/logout */}
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {user?.role?.name === "admin" && (
                      <Link href="/manage" className="block hover:text-indigo-400">Manage</Link>
                    )}
                    <button onClick={logout} className="block hover:text-indigo-400">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link href="/login" className="block hover:text-indigo-400">Login</Link>
                    <Link href="/register" className="block hover:text-indigo-400">Register</Link>
                  </div>
                )}
              </nav>

              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" className="w-full">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
