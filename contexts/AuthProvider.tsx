"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<void>;
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
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const response = await fetch('http://localhost:8081/api/users/me', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error("User not authenticated");
                    }

                    const data = await response.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("User not authenticated", err);
                setUser(null);
            } finally {
                setLoading(false); // ✅ Kết thúc loading dù thành công hay thất bại
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();

            console.log("data", data.user);

            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const logout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        try {
            const response = await fetch("http://localhost:8081/api/auth/logout", {
                method: "POST",
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

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