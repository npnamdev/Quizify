'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Pencil, Trash2, Eye, CopyPlus, Clipboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { toast } from 'sonner';
import copy from 'clipboard-copy';
import TableView from '@/components/ui-custom/TableView';
import axiosInstance from '@/lib/axiosInstance';

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  price: number;
  discount: number;
  level: string;
  language: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type CourseResponse = {
  status: string;
  message: string;
  data: any[];
  pagination?: {
    totalCourses: number;
  };
};

const columns: Column<Course>[] = [
  { header: 'Tiêu đề', accessor: 'title' },
  { header: 'Slug', accessor: 'slug' },
  { header: 'Mô tả', accessor: 'description', visible: false },
  { header: 'Giá', accessor: 'price' },
  { header: 'Giảm giá', accessor: 'discount' },
  { header: 'Cấp độ', accessor: 'level' },
  { header: 'Ngôn ngữ', accessor: 'language', visible: false },
  { header: 'Đã xuất bản', accessor: 'isPublished', type: 'badge' },
  { header: 'Ngày tạo', accessor: 'createdAt' },
  { header: 'Ngày cập nhật', accessor: 'updatedAt', visible: false },
];

const fetcher = (url: string): Promise<CourseResponse> => axiosInstance.get(url);

export default function CourseListPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  // build URL params
  const params = new URLSearchParams({
    page: String(page + 1),
    limit: String(pageSize),
  });
  if (debouncedSearch) {
    params.append('search', debouncedSearch);
    params.append('searchFields', 'title,slug,description');
  }

  const url = `/api/courses?${params.toString()}`;

  const { data, isLoading, mutate } = useSWR(url, fetcher, {
    dedupingInterval: 15000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const courses: Course[] = (data?.data || []).map((c: any) => ({
    id: c._id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    thumbnail: c.thumbnail,
    price: c.price,
    discount: c.discount,
    level: c.level,
    language: c.language,
    isPublished: c.isPublished,
    createdAt: moment(c.createdAt).format('DD/MM/YYYY'),
    updatedAt: moment(c.updatedAt).format('DD/MM/YYYY'),
  }));

  const total = data?.pagination?.totalCourses || 0;

  const copyToClipboard = (id: string | number) => {
    copy(String(id))
      .then(() => toast.success(`Đã sao chép ID: ${id}`))
      .catch(() => toast.error('Sao chép thất bại'));
  };

  const actionOptions = useMemo(() => [
    {
      value: 'copy',
      label: 'Copy ID',
      icon: <Clipboard size={16} strokeWidth={1.5} />,
      action: copyToClipboard,
    },
    {
      value: 'view',
      label: 'Xem chi tiết',
      icon: <Eye size={16} strokeWidth={1.5} />,
      action: (id: string | number) => { console.log("xem chi tiết"); },
    },
    {
      value: 'edit',
      label: 'Chỉnh sửa',
      icon: <Pencil size={16} strokeWidth={1.5} />,
      action: (id: string | number) => { console.log("Chỉnh sửa"); },

    },
    {
      value: 'duplicate',
      label: 'Nhân bản',
      icon: <CopyPlus size={16} strokeWidth={1.5} />,
      action: (id: string | number) => { console.log("nhân bản"); },

    },
    {
      value: 'delete',
      label: 'Xoá',
      icon: <Trash2 size={16} strokeWidth={1.5} />,
      action: (id: string | number) => { console.log("xóa"); },
    },
  ], []);

  return (
    <div className="space-y-4">
      <TableView<Course>
        columns={columns}
        data={courses}
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
        options={actionOptions}
        actionButton={
          <Button className="gap-1">
            <Plus className="w-4 h-4" /> Thêm khóa học
          </Button>
        }
      />
    </div>
  );
}
