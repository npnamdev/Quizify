import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | number | null;
}

interface UserData {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
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
                if (!res.ok) {
                    const errorData = await res.json();
                    toast.error(
                        `Lấy thông tin người dùng thất bại: ${errorData.message || res.statusText}`
                    );
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data);
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
            <SheetContent className="max-w-md">
                <SheetHeader>
                    <SheetTitle>Thông tin người dùng</SheetTitle>
                    <SheetDescription>
                        {isLoading && "Đang tải thông tin..."}
                        {!isLoading && !user && "Không tìm thấy thông tin người dùng."}
                    </SheetDescription>
                </SheetHeader>

                {!isLoading && user && (
                    <div className="space-y-3 mt-4 text-sm text-gray-700">
                        <p>
                            <strong>ID:</strong> {user.id}
                        </p>
                        <p>
                            <strong>Tên:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        {user.phone && (
                            <p>
                                <strong>Điện thoại:</strong> {user.phone}
                            </p>
                        )}
                        {user.address && (
                            <p>
                                <strong>Địa chỉ:</strong> {user.address}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex justify-end pt-6">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Đóng
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
