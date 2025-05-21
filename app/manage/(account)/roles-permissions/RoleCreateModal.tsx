import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Permission {
    _id: string;
    name: string;
}

export default function RoleCreateModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [formData, setFormData] = useState({
        label: "",
        name: "",
        permissions: [] as string[],
    });

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    useEffect(() => {
        if (open) {
            setLoadingPermissions(true);
            fetch("https://api.wedly.info/api/permissions")
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success" && Array.isArray(data.data)) {
                        setPermissions(data.data);
                    } else {
                        alert("Lỗi khi tải danh sách quyền.");
                    }
                })
                .catch(() => alert("Lỗi khi gọi API quyền."))
                .finally(() => setLoadingPermissions(false));
        } else {
            setFormData({ label: "", name: "", permissions: [] });
            setPermissions([]);
        }
    }, [open]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.label || !formData.name) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const response = await fetch("https://api.wedly.info/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Tạo vai trò thất bại: " + (errorData.message || response.statusText));
                return;
            }

            alert("Tạo vai trò thành công!");
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi tạo vai trò:", error);
            alert("Lỗi khi tạo vai trò.");
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
                    <div className="grid gap-2">
                        <Label htmlFor="permissions">Quyền</Label>
                        <Select
                            onValueChange={(value) =>
                                handleChange("permissions", [...formData.permissions, value])
                            }
                            disabled={loadingPermissions}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={loadingPermissions ? "Đang tải quyền..." : "Chọn quyền"} />
                            </SelectTrigger>
                            <SelectContent>
                                {permissions.map((perm) => (
                                    <SelectItem key={perm._id} value={perm._id}>
                                        {perm.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="text-sm mt-1">
                            {formData.permissions.length > 0 && (
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {formData.permissions.map((permId) => {
                                        const found = permissions.find((p) => p._id === permId);
                                        return <li key={permId}>{found?.name || permId}</li>;
                                    })}
                                </ul>
                            )}
                        </div>
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
