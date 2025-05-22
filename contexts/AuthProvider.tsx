"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/api/users/me");
                console.log("check res me", res);

                setUser(res);
            } catch (err) {
                console.error("User not authenticated", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response: any = await axiosInstance.post("/api/auth/login", { email, password });
            localStorage.setItem("accessToken", response.accessToken);
            setUser(response.user);
            toast.success("Login successfully");
            return true;
        } catch (err: any) {
            toast.error(err || "Login failed");
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/api/auth/logout");
            toast.success("Logged out successfully");
            localStorage.removeItem("accessToken");
            setUser(null);
        } catch (err: any) {
            toast.error(err || "Logout failed");
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};