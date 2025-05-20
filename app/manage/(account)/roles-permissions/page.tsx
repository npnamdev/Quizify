'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import TableView from '@/components/ui-custom/TableView';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { toast } from 'sonner';
import PermissionsModal from './PermissionsModal';
import RolePermissionEditor from './RolePermissionEditor';

type Role = {
    id: string;
    name: string;
    isSystem: boolean;
    permissions: number;
    createdAt: string;
    updatedAt: string;
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

    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState<string | number | null>(null);

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
        <div className="space-y-4">
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
                actionButton={
                    <Button onClick={() => console.log('Tạo mới')} className='gap-1'>
                        <Plus className="w-4 h-4" />
                        Thêm vai trò
                    </Button>
                }
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
                        action: (id) => {
                            setCurrentId(id);
                            setIsPermissionsModalOpen(true);
                        },
                    },
                    {
                        value: 'delete',
                        label: 'Xoá',
                        icon: <Trash2 size={16} strokeWidth={1.5} />,
                        action: (id) => console.log('Xoá vai trò với id:', id),
                    },
                ]}
            />

            {/* <PermissionsModal
                open={isPermissionsModalOpen}
                onOpenChange={setIsPermissionsModalOpen}
            /> */}

            <RolePermissionEditor
                roleId={currentId}
                open={isPermissionsModalOpen}
                onOpenChange={setIsPermissionsModalOpen}
            />
        </div>
    );
}
