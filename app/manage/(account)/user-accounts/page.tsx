'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Pencil, Trash2, Eye, Ban, Mail, Clipboard } from 'lucide-react';
import moment from 'moment';
import { toast } from "sonner";
import copy from 'clipboard-copy';
import TableView from '@/components/ui-custom/TableView';

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

type Column<T> = {
    header: string;
    accessor: keyof T;
    visible?: boolean;
    type?: 'group' | 'image' | 'system' | 'badge';
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
                        action: (id) => console.log('Xoá user với id:', id),
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
        </div>
    );
}