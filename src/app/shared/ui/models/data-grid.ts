export type SortDir = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
    id: string;
    header: string;
    accessor: (row: T) => unknown;
    sortable?: boolean;
    widthPx?: number;
}