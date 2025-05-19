import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | number | null;
}

interface UserData {
    id: string | number;
    username: string;
    fullName: string;
    email: string;
    isVerified: boolean;
    gender: string;
    role: {
        id: string;
        name: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function UserDetailsModal({
    open,
    onOpenChange,
    userId,
}: UserDetailsModalProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open || !userId) {
            setUser(null);
            return;
        }

        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`https://api.wedly.info/api/users/${userId}`);
                const json = await res.json();

                if (!res.ok || json.status !== "success") {
                    toast.error(
                        `Lấy thông tin người dùng thất bại: ${json.message || res.statusText}`
                    );
                    setUser(null);
                } else {
                    const userData = json.data;
                    setUser({
                        id: userData._id,
                        username: userData.username,
                        fullName: userData.fullName,
                        email: userData.email,
                        isVerified: userData.isVerified,
                        gender: userData.gender,
                        role: {
                            id: userData.role._id,
                            name: userData.role.name,
                        },
                        isActive: userData.isActive,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt,
                    });
                }
            } catch (error: any) {
                toast.error(`Lỗi khi lấy thông tin người dùng: ${error.message || error}`);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [open, userId]);

    const handleClose = () => {
        if (isLoading) return;
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="sm:max-w-[420px] p-0 h-dvh">
                <SheetHeader className="h-[60px] border-b flex justify-center px-6">
                    <SheetTitle className="font-semibold text-lg">
                        Thông tin người dùng
                    </SheetTitle>
                </SheetHeader>

                <div className="px-6 py-4 h-[calc(100%-120px)] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                        </div>
                    ) : user ? (
                        <div className="grid gap-4 text-sm text-gray-700">
                            {[
                                { label: "ID", value: user.id },
                                { label: "Tên đăng nhập", value: user.username },
                                { label: "Họ tên", value: user.fullName },
                                { label: "Email", value: user.email },
                                {
                                    label: "Đã xác minh",
                                    value: user.isVerified ? "Có" : "Chưa",
                                },
                                { label: "Giới tính", value: user.gender },
                                { label: "Vai trò", value: user.role.name },
                                {
                                    label: "Trạng thái hoạt động",
                                    value: user.isActive ? "Hoạt động" : "Ngừng hoạt động",
                                },
                                {
                                    label: "Ngày tạo",
                                    value: new Date(user.createdAt).toLocaleString(),
                                },
                                {
                                    label: "Ngày cập nhật",
                                    value: new Date(user.updatedAt).toLocaleString(),
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between border-b pb-2 last:border-none"
                                >
                                    <span className="text-muted-foreground font-medium">
                                        {item.label}
                                    </span>
                                    <span className="text-right max-w-[60%] break-words">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">
                            Không có dữ liệu người dùng.
                        </p>
                    )}
                </div>

                <div className="flex justify-end items-center h-[60px] border-t px-6">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Đóng
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}