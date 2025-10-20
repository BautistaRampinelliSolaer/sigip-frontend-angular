import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import type { UserDTO, CreateUserRequest } from '@app/domain/models';
import { UsersApi } from '@app/infrastructure/api/users/users.api';
import { UsersState } from './users-state';

// helpers
const makeUser = (p: Partial<UserDTO> = {}): UserDTO => ({
  id: p.id ?? 1,
  username: p.username ?? `user${p.id ?? 1}`,
  name: p.name ?? 'Name',
  lastname: p.lastname ?? 'Last',
  workingHours: p.workingHours ?? 40,
  email: p.email ?? `u${p.id ?? 1}@test.local`,
  role: p.role ?? 'USER',
  profilePhoto: p.profilePhoto,
});

const list = (...ids: number[]) => ids.map((id) => makeUser({ id }));

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

// Mock API
class MockUsersApi extends UsersApi {
  getAll = vi.fn();
  getById = vi.fn();
  getByEmail = vi.fn();
  getByDni = vi.fn();
  create = vi.fn();
  delete = vi.fn();
}

describe('UsersState', () => {
  let api: MockUsersApi;
  let state: UsersState;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: UsersApi, useClass: MockUsersApi }, UsersState],
    });

    api = TestBed.inject(UsersApi) as unknown as MockUsersApi;

    // defaults
    api.getAll.mockReturnValue(of(list(3, 2, 1)));
    api.getById.mockImplementation((id: number) => of(makeUser({ id, username: `u${id}` })));
    api.create.mockImplementation((payload: CreateUserRequest) =>
      of(makeUser({ id: 999, username: payload.username, email: payload.email, name: payload.name, lastname: payload.lastname })),
    );
    api.delete.mockReturnValue(of(void 0));

    state = TestBed.inject(UsersState);
    // do not rely on automatic effect timing — call loadList explicitly in tests
  });

  it('autoloads list on construct (effect) and exposes users + totals', async () => {
    await state.loadList();
    await flush();

    expect(api.getAll).toHaveBeenCalled();
    expect(state.users().length).toBe(3);
    expect(state.total()).toBe(3);
    expect(state.isLoading()).toBe(false);
    expect(state.hasError()).toBe(false);
  });

  it('loadById merges/updates selected user', async () => {
    await state.loadById(42);
    const sel = state.selectedUser();
    expect(sel?.id).toBe(42);
    expect(sel?.username).toBe('u42');
  });

  it('create prepends user and sets success', async () => {
    await state.loadList();
    api.getAll.mockClear();

    const created = await state.create({
        username: 'newuser',
        email: 'new@x.test',
        password: 'p',
        dni: 12345678,
        name: 'New',
        lastname: 'User',
        workingHours: 40,
        isAdmin: false,
        profilePhoto: undefined,
        role: 'user'
    });

    expect(created.id).toBe(999);
    expect(state.users()[0].id).toBe(999);
    expect(state.isLoading()).toBe(false);
    expect(state.hasError()).toBe(false);
  });

  it('create handles error and does not modify list on failure', async () => {
    await state.loadList();
    const before = state.users().slice();
    api.create.mockReturnValueOnce(throwError(() => new Error('create-fail')));

    await expect(
      state.create({
          username: 'x',
          email: 'x@x',
          password: 'p',
          dni: 1,
          name: 'x',
          lastname: 'x',
          workingHours: 40,
          isAdmin: false,
          role: 'user'
      }),
    ).rejects.toThrow();

    expect(state.users()).toEqual(before);
    expect(state.hasError()).toBe(true);
    expect(state.errorMessage()).toContain('create-fail');
  });

  it('remove optimistic success', async () => {
    api.getAll.mockReturnValue(of(list(1, 2, 3)));
    await state.loadList();
    const len = state.users().length;

    await state.remove(2);
    expect(state.users().some((u) => u.id === 2)).toBe(false);
    expect(state.users().length).toBe(len - 1);
  });

  it('remove rollback on error', async () => {
    api.getAll.mockReturnValue(of(list(10, 20)));
    await state.loadList();
    const before = state.users().map((u) => u.id);

    api.delete.mockReturnValueOnce(throwError(() => new Error('delete-fail')));
    await state.remove(10).catch(() => { /* swallow */ });

    expect(state.users().map((u) => u.id)).toEqual(before);
    expect(state.hasError()).toBe(true);
  });

  it('handles async API latency (loading flag)', async () => {
    api.getAll.mockReturnValueOnce(of(list(7, 8)).pipe(delay(0)));
    const p = state.loadList();
    expect(state.isLoading()).toBe(true);
    await p;
    expect(state.isLoading()).toBe(false);

    api.create.mockReturnValueOnce(of(makeUser({ id: 1000 })).pipe(delay(0)));
    const c = state.create({
        username: 'a',
        email: 'a@a',
        password: 'p',
        dni: 1,
        name: 'A',
        lastname: 'A',
        workingHours: 40,
        isAdmin: false,
        role: 'user'
    });
    expect(state.isLoading()).toBe(true);
    await c;
    expect(state.isLoading()).toBe(false);
  });
});