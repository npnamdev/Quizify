import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRoles } from "@/hooks/use-roles";
import axiosInstance from "@/lib/axiosInstance";

export default function CreateUserModal({ open, onOpenChange, mutate }: { open: boolean; onOpenChange: (open: boolean) => void; mutate: () => void; }) {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");

    const { data, isLoading: loadingRoles } = useRoles({ page: 0, pageSize: 100 });
    const roles = data?.data || [];

    useEffect(() => {
        if (!open) {
            setUsername("");
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("");
        }
    }, [open]);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Mật khẩu và xác nhận không khớp");
            return;
        }
        try {
            await axiosInstance.post("/api/users", { username, fullName, email, password, role, isVerified: true });
            toast.success("Tạo người dùng thành công!");
            mutate();
            onOpenChange(false);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Tạo người dùng thất bại";
            toast.error(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] p-0">
                <DialogHeader className="h-[55px] flex justify-center border-b px-7">
                    <DialogTitle className="text-md font-bold">Thêm mới người dùng</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 px-7">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Họ tên</Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập họ và tên đầy đủ"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                            value={role}
                            onValueChange={(value) => setRole(value)}
                            disabled={loadingRoles}
                            required
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
                </div>
                <DialogFooter className="flex justify-end items-center border-t h-[60px] px-7 gap-1">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Đóng
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Tạo người dùng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
