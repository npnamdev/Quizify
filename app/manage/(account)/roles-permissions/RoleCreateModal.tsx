import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

export default function RoleCreateModal({
    open,
    onOpenChange,
    mutate,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mutate: () => void;
}) {
    const [label, setLabel] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setLabel("");
        }
    }, [open]);

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD") // tách dấu
            .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
            .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu -
            .replace(/[^\w\-]+/g, "") // bỏ ký tự đặc biệt
            .replace(/\-\-+/g, "-") // bỏ dấu - lặp
            .replace(/^-+/, "") // bỏ dấu - đầu chuỗi
            .replace(/-+$/, ""); // bỏ dấu - cuối chuỗi
    };

    const handleCreateRole = async () => {
        if (!label.trim()) {
            toast.error("Vui lòng nhập tên vai trò.");
            return;
        }

        const name = slugify(label);

        setLoading(true);
        try {
            await axiosInstance.post("/api/roles", { label, name, permissions: [] });
            toast.success("Tạo vai trò thành công!");
            onOpenChange(false);
            mutate();
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
            toast.error("Tạo vai trò thất bại: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogHeader className="h-[55px] flex justify-center border-b px-7">
                    <DialogTitle className="text-md font-bold">Thêm mới vai trò</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 px-7 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="label">Tên vai trò</Label>
                        <Input
                            id="label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Nhập tên vai trò, ví dụ: Quản trị viên"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end items-center border-t h-[60px] px-7 gap-1">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={loading}>
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button onClick={handleCreateRole} disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo vai trò"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
