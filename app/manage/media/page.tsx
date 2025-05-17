'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import TableView from '@/components/ui-custom/TableView';
import { Eye, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { formatBytes } from "@/utils/utils";
import ImageCropper from "@/components/ui-custom/ImageCropper";

type Media = {
    id: string;
    url: string;
    secure_url: string;
    format: string;
    resource_type: string;
    bytes: number;
    original_filename: string;
    createdAt: string;
    updatedAt: string;
};

const columns: Column<Media>[] = [
    { header: 'Hình ảnh', accessor: 'secure_url', type: 'image-preview' },
    { header: 'Loại', accessor: 'resource_type' },
    { header: 'Định dạng', accessor: 'format', type: "system" },
    { header: 'Kích thước', accessor: 'bytes' },
    { header: 'Ngày tạo', accessor: 'createdAt' },
    { header: 'Ngày cập nhật', accessor: 'updatedAt' },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MediaListPage() {
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
        queryParams.append('searchFields', 'original_filename');
    }

    const url = `https://api.wedly.info/api/media?${queryParams.toString()}`;
    const { data, isLoading } = useSWR(url, fetcher);

    const mediaList: Media[] = (data?.data || []).map((item: any) => ({
        id: item._id,
        url: item.url,
        secure_url: item.secure_url,
        format: item.format,
        resource_type: item.resource_type,
        bytes: formatBytes(item.bytes),
        original_filename: item.original_filename,
        createdAt: moment(item.createdAt).format('DD/MM/YYYY'),
        updatedAt: moment(item.updatedAt).format('DD/MM/YYYY'),
    }));

    // ✅ Sử dụng totalMedias từ pagination
    const total = data?.pagination?.totalMedias || 0;

    return (
        <div className="space-y-4">
            <TableView<Media>
                columns={columns}
                data={mediaList}
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
                    <ImageCropper />
                }
                options={[
                    {
                        value: 'view',
                        label: 'Xem ảnh',
                        icon: <Eye size={16} />,
                        action: (id) => {
                            const media = mediaList.find((m) => m.id === id);
                            if (media) window.open(media.secure_url, '_blank');
                        },
                    },
                    {
                        value: 'delete',
                        label: 'Xoá',
                        icon: <Trash2 size={16} />,
                        action: (id) => {
                            console.log('Xoá media với id:', id);
                            // Gọi API xoá nếu cần
                        },
                    },
                ]}
            />
        </div>
    );
}