import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Simple in-memory fallback that mimics a minimal Storage interface */
export class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null { return this.map.has(key) ? this.map.get(key)! : null; }
  setItem(key: string, value: string): void { this.map.set(key, value); }
  removeItem(key: string): void { this.map.delete(key); }
}

/** Feature detection for usable localStorage (handles private mode/quota issues) */
function getUsableBrowserStorage(): StorageLike {
  try {
    const ls = globalThis?.localStorage as StorageLike | undefined;
    if (!ls) return new MemoryStorage();
    const probe = '__storage_probe__';
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    // Not available or quota errors → fall back to memory
    return new MemoryStorage();
  }
}

/** DI token selecting the proper storage engine per platform */
export const STORAGE_ENGINE = new InjectionToken<StorageLike>('STORAGE_ENGINE', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? getUsableBrowserStorage() : new MemoryStorage();
  },
});