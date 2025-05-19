import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface UserUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | number | null;
}

interface UserData {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    // thêm các trường cần chỉnh sửa ở đây
}

export default function UserUpdateModal({ open, onOpenChange, userId }: UserUpdateModalProps) {
    const [userData, setUserData] = useState<UserData>({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Lấy dữ liệu user khi modal mở và có userId
    useEffect(() => {
        if (open && userId) {
            setIsLoading(true);
            fetch(`https://api.wedly.info/api/users/${userId}`)
                .then((res) => res.json())
                .then((data) => {
                    setUserData({
                        fullName: data.fullName || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                        role: data.role?.name || "",
                    });
                })
                .catch(() => alert("Lỗi khi tải thông tin người dùng"))
                .finally(() => setIsLoading(false));
        }
    }, [open, userId]);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!userId) return;
        setIsSaving(true);
        try {
            const res = await fetch(`https://api.wedly.info/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (!res.ok) {
                const errorData = await res.json();
                alert(`Cập nhật thất bại: ${errorData.message || res.statusText}`);
                setIsSaving(false);
                return;
            }
            alert("Cập nhật người dùng thành công!");
            onOpenChange(false);
        } catch (error) {
            alert(`Lỗi khi cập nhật người dùng: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                        {isLoading ? "Đang tải thông tin..." : "Cập nhật thông tin người dùng"}
                    </DialogDescription>
                </DialogHeader>

                {!isLoading && (
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={userData.fullName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Số điện thoại</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Vai trò</label>
                            <select
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="admin">Quản trị viên</option>
                                <option value="user">Người dùng</option>
                            </select>
                        </div>
                    </form>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? "Đang lưu..." : "Lưu"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
