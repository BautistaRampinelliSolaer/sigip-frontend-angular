import { inject, Injectable } from '@angular/core';
import { STORAGE_ENGINE, type StorageLike } from './storage.token';

@Injectable({ providedIn: 'root' })
export class UniversalStorage {
  private readonly engine: StorageLike = inject(STORAGE_ENGINE);

  /** Get and JSON.parse a value; returns null on missing/invalid JSON */
  get<T>(key: string): T | null {
    const raw = this.engine.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Defensive: cleanup corrupted entry to keep storage consistent
      this.engine.removeItem(key);
      return null;
    }
  }

  /** Stringify and set; gracefully ignore quota/unavailable errors */
  set<T>(key: string, value: T): void {
    try {
      this.engine.setItem(key, JSON.stringify(value));
    } catch {
      // Swallow quota/unavailable errors (feature-availability varies per browser)
      // See: Web Storage API notes on quotas/private mode
    }
  }

  remove(key: string): void {
    try {
      this.engine.removeItem(key);
    } catch {
      // No-op: engine might be unavailable; keep API safe
    }
  }
}