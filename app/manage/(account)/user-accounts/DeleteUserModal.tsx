import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

interface DeleteUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | number | null;
}

export default function DeleteUserModal({ open, onOpenChange, userId }: DeleteUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleDelete = async () => {
        if (!userId) return;

        setIsLoading(true);

        try {
            await axiosInstance.delete(`/users/${userId}`);
            toast.success("Đã xóa người dùng thành công!");
            onOpenChange(false);
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || "Đã xảy ra lỗi khi xóa người dùng.";
            toast.error(`Xóa người dùng thất bại: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa người dùng? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? "Đang xóa..." : "Xóa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
