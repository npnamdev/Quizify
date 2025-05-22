import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

// const fetcher = (url: string) => axiosInstance.get(url);

const fetcher = (url: string): Promise<RoleResponse> => axiosInstance.get(url);


interface RoleResponse {
    data: any[];
    pagination: {
        totalRoles: number;
    };
}

interface UseRolesParams {
    page: number;
    pageSize: number;
    search?: string;
}

export const useRoles = ({ page, pageSize, search }: UseRolesParams) => {
    const queryParams = new URLSearchParams({
        limit: String(pageSize),
        page: String(page + 1),
    });

    if (search) {
        queryParams.append('search', search);
        queryParams.append('searchFields', 'name');
    }

    const url = `/roles?${queryParams.toString()}`;

    const { data, error, isLoading, mutate } = useSWR<RoleResponse>(url, fetcher, {
        dedupingInterval: 60 * 1000,
    });

    return {
        data,
        isLoading,
        isError: !!error,
        mutateRoles: mutate,
    };
};