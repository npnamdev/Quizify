"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace("/login");
            }

            else if (user?.role?.name !== "admin") {
                router.replace("/unauthorized");
            }
        }
    }, [isAuthenticated, user, loading]);

    if (loading || !isAuthenticated || user?.role?.name !== "admin") {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
