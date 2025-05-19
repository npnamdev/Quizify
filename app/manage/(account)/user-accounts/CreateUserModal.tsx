import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Role {
    _id: string;
    name: string;
}

export default function CreateUserModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Load roles mỗi khi modal mở
    useEffect(() => {
        if (open) {
            setLoadingRoles(true);
            fetch("https://api.wedly.info/api/roles")
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success" && Array.isArray(data.data)) {
                        setRoles(data.data);
                    } else {
                        alert("Lỗi khi tải danh sách vai trò");
                        setRoles([]);
                    }
                })
                .catch(() => {
                    alert("Lỗi khi gọi API vai trò");
                    setRoles([]);
                })
                .finally(() => setLoadingRoles(false));
        } else {
            // Reset form và roles khi đóng modal (tùy chọn)
            setFormData({
                username: "",
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "",
            });
            setRoles([]);
        }
    }, [open]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("formData", formData);


        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu và Nhập lại mật khẩu không khớp.");
            return;
        }

        try {
            const response = await fetch("https://api.wedly.info/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Tạo người dùng thất bại: " + (errorData.message || response.statusText));
                return;
            }

            const data = await response.json();
            console.log("Tạo người dùng thành công:", data);
            alert("Tạo người dùng thành công!");
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi tạo người dùng:", error);
            alert("Lỗi khi tạo người dùng, vui lòng thử lại.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm mới người dùng</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin người dùng để thêm vào hệ thống.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Họ tên</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Nhập họ và tên đầy đủ"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleChange("role", value)}
                            required
                            disabled={loadingRoles}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder={loadingRoles ? "Đang tải vai trò..." : "Chọn vai trò"} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.length === 0 && !loadingRoles && (
                                    <SelectItem value="no-role" disabled>
                                        Không có vai trò
                                    </SelectItem>
                                )}
                                {roles.map((role) => (
                                    <SelectItem key={role._id} value={role._id}>
                                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Tạo người dùng</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
