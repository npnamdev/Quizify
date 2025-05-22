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
    const [pageSize, setPageSize] = useState(10);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [isRoleCreateModalOpen, setIsRoleCreateModalOpen] = useState(false);
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
        name: role.name === 'admin' ? 'Quản trị viên' : role.name === 'user' ? 'Người dùng' : role.name,
        isSystem: role.isSystem || false,
        permissions: 20,
        createdAt: moment(role.createdAt).format('DD/MM/YYYY'),
        updatedAt: moment(role.updatedAt).format('DD/MM/YYYY'),
    }));

    const total = data?.pagination?.totalRoles || 0;


    const handleCreateRole = async ({ label, name }: { label: string; name: string }) => {
        try {
            await axiosInstance.post("/roles", { label, name, permissions: [] });
            toast.success("Tạo vai trò thành công!");
            setIsRoleCreateModalOpen(false);
            mutateRoles();
        } catch (error: any) {
            toast.error("Tạo vai trò thất bại: " + error);
        }
    };


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
                    <Button onClick={() => setIsRoleCreateModalOpen(true)} className="gap-1">
                        <Plus className="w-4 h-4" /> <span>Thêm vai trò</span>
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

            <RoleCreateModal
                open={isRoleCreateModalOpen}
                onOpenChange={setIsRoleCreateModalOpen}
                onSubmit={handleCreateRole}
            />


            <RolePermissionEditor
                roleId={currentId}
                open={isPermissionsModalOpen}
                onOpenChange={setIsPermissionsModalOpen}
            />
        </div>
    );
}