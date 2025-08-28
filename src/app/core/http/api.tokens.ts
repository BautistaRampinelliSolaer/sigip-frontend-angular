import { InjectionToken } from "@angular/core";

export const API_URL = new InjectionToken<string>('API_URL', {
    factory: () => (typeof window === 'undefined'
        ? (globalThis as any).__API_URL__ ?? 'http://localhost:1717'
        : 'http://localhost:1717'
    )
});