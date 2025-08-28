export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RequestMeta {
    status: RequestStatus;
    error: string | null;
    staleAt: number | null;
}

export const TTL_5_MINUTES = 5 * 60 * 1000;