import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Menubar from "@/components/ui-custom/Menubar";
import HeaderLayout from "@/components/ui-custom/HeaderLayout";
import AuthGuard from "@/contexts/AuthGuard";

export default function ManageLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <SidebarProvider className="text-black font-semibold select-none">
                <Menubar />
                <SidebarInset className="bg-gray-100">
                    <HeaderLayout />
                    <div className="overflow-auto px-4 py-3 h-[calc(100dvh-60px)] ">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    )
}