'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import TableView from '@/components/ui-custom/TableView';
import { Pencil, Trash2, Eye } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

type Role = {
    id: string;
    name: string;
    isSystem: boolean;
    permissions: number;
    createdAt: string;
    updatedAt: string;
};

type Column<T> = {
    header: string;
    accessor: keyof T;
    visible?: boolean;
    type?: 'group' | 'image' | 'system' | 'badge';
};

const columns: Column<Role>[] = [
    { header: 'Tên vai trò', accessor: 'name' },
    { header: 'Loại vai trò', accessor: 'isSystem', type: 'system' },
    { header: 'Quyền', accessor: 'permissions' },
    { header: 'Ngày tạo', accessor: 'createdAt' },
    { header: 'Ngày cập nhật', accessor: 'updatedAt' },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoleListPage() {
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
        queryParams.append('searchFields', 'name');
    }

    const url = `https://api.wedly.info/api/roles?${queryParams.toString()}`;

    const { data, isLoading } = useSWR(url, fetcher);

    const roles: Role[] = (data?.data || []).map((role: any) => ({
        id: role._id,
        name:
            role.name === 'admin'
                ? 'Quản trị viên'
                : role.name === 'user'
                    ? 'Người dùng'
                    : role.name,
        isSystem: role.isSystem || 'Hệ thống',
        permissions: 20,
        createdAt: moment(role.createdAt).format('DD/MM/YYYY'),
        updatedAt: moment(role.updatedAt).format('DD/MM/YYYY'),
    }));

    const total = data?.pagination?.total || 0;

    return (
        <div className="p-6 space-y-4">
            <TableView<Role>
                columns={columns}
                data={roles}
                pageSize={pageSize}
                currentPage={page}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(0);
                }}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                isLoading={isLoading}
                options={[
                    {
                        value: 'view',
                        label: 'Xem chi tiết',
                        icon: <Eye size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Xem chi tiết vai trò với id:', id),
                    },
                    {
                        value: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <Pencil size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Chỉnh sửa vai trò với id:', id),
                    },
                    {
                        value: 'delete',
                        label: 'Xoá',
                        icon: <Trash2 size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Xoá vai trò với id:', id),
                    },
                ]}
            />
        </div>
    );
}