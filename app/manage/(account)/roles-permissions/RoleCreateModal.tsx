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
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { label: string; name: string }) => void;
}) {
    const [label, setLabel] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open) {
            setLabel("");
            setName("");
        }
    }, [open]);

    const handleSubmit = () => {
        if (!label || !name) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        onSubmit({ label, name });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogHeader className="h-[55px] flex justify-center border-b px-7">
                    <DialogTitle className="text-md font-bold">Thêm mới vai trò</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 px-7 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="label">Tên hiển thị</Label>
                        <Input
                            id="label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Nhập tên hiển thị"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên vai trò (system name)</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="admin, editor, etc."
                            required
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end items-center border-t h-[60px] px-7 gap-1">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Tạo vai trò</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
