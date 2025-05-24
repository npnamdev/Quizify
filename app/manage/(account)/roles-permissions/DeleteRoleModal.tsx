import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

interface DeleteRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roleId: string | number | null;
    mutate: () => void;
}

export default function DeleteRoleModal({
    open,
    onOpenChange,
    roleId,
    mutate,
}: DeleteRoleModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleDelete = async () => {
        if (!roleId) return;

        setIsLoading(true);

        try {
            await axiosInstance.delete(`/api/roles/${roleId}`);
            mutate();
            toast.success("Đã xóa vai trò thành công!");
            onOpenChange(false);
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Đã xảy ra lỗi khi xóa vai trò.";
            toast.error(`Xóa vai trò thất bại: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa vai trò</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn
                        tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xóa..." : "Xóa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
