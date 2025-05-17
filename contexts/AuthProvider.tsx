"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner"

interface AuthContextType {
    user: any;
    // login: (email: string, password: string) => Promise<void>;
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
                let token = localStorage.getItem("accessToken");

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include',
                });

                if (res.status === 401) {
                    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        localStorage.setItem("accessToken", refreshData.accessToken);
                        token = refreshData.accessToken;

                        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                            method: 'GET',
                            headers: { Authorization: `Bearer ${token}` },
                            credentials: 'include',
                        });

                        if (!retryRes.ok) throw new Error("Retry fetchUser failed");

                        const retryData = await retryRes.json();
                        setUser(retryData);
                    } else {
                        throw new Error("Refresh token failed");
                    }
                } else if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    throw new Error("User not authenticated");
                }
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errData = await response.json();
                toast.error(errData.message || "Login failed");
                return false;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
            toast.success("Login successfully");
            return true;
        } catch (err) {
            toast.error("Login failed");
            console.error(err);
            return false;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: 'include',
            });

            console.log("response", response);


            if (!response.ok) {
                throw new Error("Logout failed");
            }

            toast.success("Logged out successfully");



            localStorage.removeItem("accessToken");
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
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