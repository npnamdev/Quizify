import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner"

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
            const res = await fetch(`https://api.wedly.info/api/users/${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(`Xóa người dùng thất bại: ${errorData.message || res.statusText}`)
                setIsLoading(false);
                return;
            }

            toast.success(`Đã xóa người dùng thành công!`)
            onOpenChange(false);
        } catch (error) {
            toast.error(`Lỗi khi xóa người dùng: ${error}`)
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
                        Bạn có chắc chắn muốn xóa người dùng ? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end space-x-2 pt-4">
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
