import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export default function RoleCreateModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) {
    const [formData, setFormData] = useState({ label: "", name: "" });

    useEffect(() => {
        if (!open) {
            setFormData({ label: "", name: "" });
        }
    }, [open]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.label || !formData.name) {
            toast.error("Vui lòng nhập đầy đủ thông tin.")
            return;
        }

        try {
            const response = await fetch("https://api.wedly.info/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, permissions: [] }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Tạo vai trò thất bại: " + (errorData.message || response.statusText))
                return;
            }

            toast.success("Tạo vai trò thành công!")
            onOpenChange(false);
        } catch (error) {
            toast.success("Lỗi khi tạo vai trò.")
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
                        <Label htmlFor="label">Tên hiển thị</Label>
                        <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => handleChange("label", e.target.value)}
                            placeholder="Nhập tên hiển thị"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên vai trò (system name)</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
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
