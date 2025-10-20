import { DOCUMENT, inject, Injectable } from "@angular/core";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

@Injectable({
    providedIn: 'root',
})
export class BrowserStorage implements StorageLike {
    private readonly doc = inject(DOCUMENT);
    private get storage(): StorageLike {
        return this.doc.defaultView?.localStorage ?? new MemoryStorage();
    }
    getItem(key: string): string | null {
        return this.storage.getItem(key);
    }
    setItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }
    removeItem(key: string): void {
        this.storage.removeItem(key);
    }
}
