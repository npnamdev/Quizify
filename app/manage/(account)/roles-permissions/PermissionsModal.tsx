import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";  
import { useState, useEffect } from "react";

interface Permission {
    _id: string;
    name: string;
}

export default function PermissionsModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch("https://api.wedly.info/api/permissions")
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success" && Array.isArray(data.data)) {
                        setPermissions(data.data);
                    } else {
                        alert("Lỗi khi tải danh sách permissions");
                        setPermissions([]);
                    }
                })
                .catch(() => {
                    alert("Lỗi khi gọi API permissions");
                    setPermissions([]);
                })
                .finally(() => setLoading(false));
        } else {
            setPermissions([]);
            setSelectedPermissions([]);
        }
    }, [open]);

    const togglePermission = (id: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Permissions được chọn:", selectedPermissions);
        alert("Permissions đã được lưu!");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chọn Permissions</DialogTitle>
                    <DialogDescription>Chọn các quyền cho người dùng.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-64 overflow-auto">
                    {loading && <p>Đang tải permissions...</p>}
                    {!loading && permissions.length === 0 && <p>Không có permissions để hiển thị.</p>}

                    {!loading &&
                        permissions.map((perm) => (
                            <div key={perm._id} className="flex items-center space-x-2">
                                <Switch
                                    id={perm._id}
                                    checked={selectedPermissions.includes(perm._id)}
                                    onCheckedChange={() => togglePermission(perm._id)}
                                />
                                <label htmlFor={perm._id} className="cursor-pointer select-none">
                                    {perm.name}
                                </label>
                            </div>
                        ))}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            Lưu permissions
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
