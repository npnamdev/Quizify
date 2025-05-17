type Column<T> = {
    header: string;
    accessor: keyof T;
    visible?: boolean;
    type?: 'group' | 'image' | 'system' | 'badge' | 'image-preview';
};