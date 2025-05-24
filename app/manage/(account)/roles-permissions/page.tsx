'use client';

import React, { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/use-roles';
import TableView from '@/components/ui-custom/TableView';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import RolePermissionEditor from './RolePermissionEditor';
import RoleCreateModal from './RoleCreateModal';
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import DeleteRoleModal from './DeleteRoleModal';

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

export default function RoleListPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [isRoleCreateModalOpen, setIsRoleCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState<string | number | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput); setPage(0);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data, isLoading, mutateRoles } = useRoles({ page, pageSize, search: debouncedSearch });

    const roles: Role[] = (data?.data || []).map((role: any) => ({
        id: role._id,
        name: role.label,
        isSystem: role.isSystem || false,
        permissions: 20,
        createdAt: moment(role.createdAt).format('DD/MM/YYYY'),
        updatedAt: moment(role.updatedAt).format('DD/MM/YYYY'),
    }));

    const total = data?.pagination?.totalRoles || 0;

    return (
        <div className="space-y-4">
            <TableView<Role>
                columns={columns}
                data={roles}
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
                actionButton={
                    <Button onClick={() => setIsRoleCreateModalOpen(true)} className="gap-1 px-3">
                        <Plus className="w-4 h-4" />
                        <span className='hidden md:flex'>Thêm vai trò</span>
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
                        action: (id) => {
                            setCurrentId(id)
                            setIsDeleteModalOpen(true);
                        },
                    },
                ]}
            />

            <RoleCreateModal
                open={isRoleCreateModalOpen}
                onOpenChange={setIsRoleCreateModalOpen}
                mutate={mutateRoles}
            />

            <DeleteRoleModal
                mutate={mutateRoles}
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                roleId={currentId}
            />

            <RolePermissionEditor
                roleId={currentId}
                open={isPermissionsModalOpen}
                onOpenChange={setIsPermissionsModalOpen}
            />
        </div>
    );
}