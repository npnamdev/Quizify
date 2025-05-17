'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Pencil, Trash2, Eye, Ban, Mail, Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { toast } from "sonner";
import copy from 'clipboard-copy';
import TableView from '@/components/ui-custom/TableView';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type User = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
    avatarUrl: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    address: string;
};

const columns: Column<User>[] = [
    { header: 'Họ và tên', accessor: 'fullName' },
    { header: 'Tên người dùng', accessor: 'username', visible: false },
    { header: 'Email', accessor: 'email' },
    { header: 'Số điện thoại', accessor: 'phoneNumber', visible: false },
    { header: 'Vai trò', accessor: 'role' },
    { header: 'Trạng thái', accessor: 'isActive', type: "badge" },
    { header: 'Ngày sinh', accessor: 'dateOfBirth', visible: false },
    { header: 'Giới tính', accessor: 'gender', visible: false },
    { header: 'Địa chỉ', accessor: 'address', visible: false },
    { header: 'Ngày tạo', accessor: 'createdAt' },
    { header: 'Ngày cập nhật', accessor: 'updatedAt', visible: false },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const queryParams = new URLSearchParams({
        limit: String(pageSize),
        page: String(page + 1),
    });

    if (debouncedSearch) {
        queryParams.append('search', debouncedSearch);
        queryParams.append('searchFields', 'fullName,username,email');
    }

    const url = `https://api.wedly.info/api/users?${queryParams.toString()}`;

    const { data, isLoading } = useSWR(url, fetcher);

    const users: User[] = (data?.data || []).map((user: any) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString(),
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        role: user.role?.name === 'admin' ? 'Quản trị viên' : user.role?.name === 'user' ? 'Người dùng' : user.role?.name || '',
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: moment(user.createdAt).format('DD/MM/YYYY'),
        updatedAt: moment(user.updatedAt).format('DD/MM/YYYY'),
        address: user.address
            ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}, ${user.address.country}`
            : '',
    }));

    const total = data?.pagination?.total || 0;

    const copyToClipboardById = (id: string | number) => {
        copy(`${id}`).then(() => {
            toast.success(`Đã sao chép Id: ${id}`);
        }).catch((error) => {
            toast.error("Đã xảy ra lỗi khi sao chép.");
        });
    }

    const handleAddUser = () => {
        setIsAddModalOpen(true);
    };

    const handleSubmit = () => {
        console.log({ fullName, email, password, role });
        setIsAddModalOpen(false);
    };

    const deleteUser = async (userId: string | number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await fetch(`http://api.wedly.info/api/users/${userId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            const result = await response.json();
            toast.success("User deleted successfully");
            console.log(result); // Log or handle response data if necessary
        } catch (error) {
            console.error("Delete user failed:", error);
        }
    };


    return (
        <div className="space-y-4">
            <TableView <User>
                columns={columns}
                data={users}
                pageSize={pageSize}
                currentPage={page}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                isLoading={isLoading}
                onActionAdd={handleAddUser}
                actionButton={
                    <Button onClick={() => console.log('Tạo mới')} className='gap-1'>
                        <Plus className="w-4 h-4" />
                        Thêm người dùng
                    </Button>
                }

                options={[
                    {
                        value: "copy",
                        label: "Copy ID",
                        icon: <Clipboard size={16} strokeWidth={1.5} />,
                        action: (id) => copyToClipboardById(id)
                    },
                    {
                        value: 'view',
                        label: 'Xem chi tiết',
                        icon: <Eye size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Xem chi tiết user với id:', id),
                    },
                    {
                        value: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <Pencil size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Chỉnh sửa user với id:', id),
                    },
                    {
                        value: 'delete',
                        label: 'Xoá',
                        icon: <Trash2 size={16} strokeWidth={1.5} />,
                        action: (id) => deleteUser(id)
                    },
                    {
                        value: 'ban',
                        label: 'Khoá tài khoản',
                        icon: <Ban size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Khoá tài khoản user với id:', id),
                    },
                    {
                        value: 'email',
                        label: 'Gửi Email',
                        icon: <Mail size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Gửi email đến user với id:', id),
                    },
                ]}
            />
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className='w-[94%] rounded-lg'>
                    <DialogHeader>
                        <DialogTitle className='text-md'>Thêm người dùng mới</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Họ tên</Label>
                            <Input
                                className='text-sm h-10'
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nhập họ và tên đầy đủ"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                className='text-sm h-10'
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email (vd: example@gmail.com)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                className='text-sm h-10'
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                            <Input
                                className="text-sm h-10"
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Xác nhận lại mật khẩu"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Vai trò</Label>
                            <Select onValueChange={(value: string) => setRole(value)} value={role}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="Chọn vai trò người dùng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="user">Người dùng</SelectItem>
                                        <SelectItem value="admin">Quản trị viên</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end pt-2 gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Trở lại
                                </Button>
                            </DialogClose>
                            <Button onClick={handleSubmit}>Tạo người dùng</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}