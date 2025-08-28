import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { STORAGE_ENGINE, MemoryStorage, type StorageLike } from './storage.token';

/** Keep original global localStorage to restore after each test */
let originalLocalStorage: any;

beforeEach(() => {
  originalLocalStorage = (globalThis as any).localStorage;
});

afterEach(() => {
  (globalThis as any).localStorage = originalLocalStorage;
  TestBed.resetTestingModule();
});

function createFakeStorage(initial: Record<string, string> = {}): StorageLike {
  const m = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
  };
}

describe('STORAGE_ENGINE factory (minimal guardrails)', () => {
  it('provides MemoryStorage on server platform', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const engine = TestBed.inject(STORAGE_ENGINE);
    expect(engine).toBeInstanceOf(MemoryStorage);

    // sanity: usable in-memory behavior
    engine.setItem('k', 'v');
    expect(engine.getItem('k')).toBe('v');
    engine.removeItem('k');
    expect(engine.getItem('k')).toBeNull();
  });

  it('uses browser localStorage when available and writable', () => {
    // Provide a working localStorage for the test
    const fake = createFakeStorage();
    (globalThis as any).localStorage = fake;

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    const engine = TestBed.inject(STORAGE_ENGINE);

    // Should use provided localStorage (feature-detected)
    expect(engine).toBe(fake);

    engine.setItem('k', 'v');
    expect(engine.getItem('k')).toBe('v');
    engine.removeItem('k');
    expect(engine.getItem('k')).toBeNull();
  });

  it('falls back to MemoryStorage if browser localStorage throws (quota/unavailable)', () => {
    // Simulate broken localStorage that throws on setItem
    (globalThis as any).localStorage = {
      getItem: (_: string) => null,
      setItem: (_: string, __: string) => { throw new Error('QuotaExceededError'); },
      removeItem: (_: string) => {},
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    const engine = TestBed.inject(STORAGE_ENGINE);

    // Fallback should be MemoryStorage (not the broken localStorage)
    expect(engine).toBeInstanceOf(MemoryStorage);

    // And it should be safely usable
    expect(() => engine.setItem('k', 'v')).not.toThrow();
    expect(engine.getItem('k')).toBe('v');
  });
});
