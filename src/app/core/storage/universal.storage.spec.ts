import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { UniversalStorage } from './universal.storage';
import { STORAGE_ENGINE, type StorageLike, MemoryStorage } from './storage.token';

// ---- Helpers / fakes -------------------------------------------------------

function createEngineSpy(initial: Record<string, string> = {}): StorageLike & {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
} {
  const mem = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((k: string) => (mem.has(k) ? mem.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => { mem.set(k, v); }),
    removeItem: vi.fn((k: string) => { mem.delete(k); }),
  };
}

describe('UniversalStorage (unit)', () => {
  afterEach(() => vi.clearAllMocks());

  describe('with injected fake engine', () => {
    let service: UniversalStorage;
    let engine: ReturnType<typeof createEngineSpy>;

    beforeEach(() => {
      engine = createEngineSpy();
      TestBed.configureTestingModule({
        providers: [
          { provide: STORAGE_ENGINE, useValue: engine },
          UniversalStorage,
        ],
      });
      service = TestBed.inject(UniversalStorage);
    });

    it('get(): should return parsed object and null on missing key', () => {
      engine.setItem('a', JSON.stringify({ x: 1 }));
      expect(service.get<{ x: number }>('a')).toEqual({ x: 1 });
      expect(service.get('missing')).toBeNull();
    });

    it('get(): should remove and return null on invalid JSON', () => {
      engine.setItem('bad', '{not:json}');
      expect(service.get('bad')).toBeNull();
      expect(engine.removeItem).toHaveBeenCalledWith('bad');
    });

    it('set(): should stringify and delegate to engine', () => {
      const payload = { id: 1, name: 'Ana' };
      service.set('user', payload);
      expect(engine.setItem).toHaveBeenCalledWith('user', JSON.stringify(payload));
      // sanity: value roundtrip
      expect(service.get<typeof payload>('user')).toEqual(payload);
    });

    it('set(): should NOT throw if engine.setItem throws (quota/unavailable)', () => {
      engine.setItem.mockImplementation(() => { throw new Error('QuotaExceededError'); });
      expect(() => service.set('k', { a: 1 })).not.toThrow();
    });

    it('remove(): should delegate to engine', () => {
      service.remove('x');
      expect(engine.removeItem).toHaveBeenCalledWith('x');
    });
  });

  describe('STORAGE_ENGINE factory', () => {
    it('should provide MemoryStorage on PLATFORM_ID="server"', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          UniversalStorage,
        ],
      });
      const engine = TestBed.inject(STORAGE_ENGINE);
      // We expect fallback; engine should not be the real localStorage
      // and should behave like an in-memory store
      expect(engine instanceof MemoryStorage).toBe(true);

      // Sanity: can read/write/remove
      engine.setItem('k', 'v');
      expect(engine.getItem('k')).toBe('v');
      engine.removeItem('k');
      expect(engine.getItem('k')).toBeNull();
    });

    it('should be writable in browser platform (guarded by feature detection)', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          UniversalStorage,
        ],
      });
      const engine = TestBed.inject(STORAGE_ENGINE);

      // Regardless of real environment, engine must be usable (either localStorage or memory fallback)
      expect(() => {
        engine.setItem('__probe__', '1');
        engine.removeItem('__probe__');
      }).not.toThrow();
    });
  });
});