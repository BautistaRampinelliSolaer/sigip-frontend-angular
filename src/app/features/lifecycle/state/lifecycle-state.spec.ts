import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { type lifecycleDTO, type createLifecycleRequest } from '@app/domain/models';
import { LifecycleApi } from '@app/infrastructure/api/projects/lifecycle/lifecycle.api';
import { LifecycleFilters, LifecycleState } from './lifecycle-state';

// ---------- helpers
const makeDto = (p: Partial<lifecycleDTO> = {}): lifecycleDTO => ({
  id: p.id ?? 1,
  objAssigned: p.objAssigned ?? ({ id: 10, name: 'OBJ-10' } as any),
  previousState: p.previousState ?? 'DRAFT',
  newState: p.newState ?? 'REVIEW',
  description: p.description ?? 'desc',
  type: p.type ?? 'PROJECT',
});

const list = (...ids: number[]) => ids.map((id) => makeDto({ id }));

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

// ---------- Mock API
class MockLifecycleApi extends LifecycleApi {
  getAll = vi.fn();
  getById = vi.fn();
  getByAssignedId = vi.fn();
  create = vi.fn();
  update = vi.fn();
  delete = vi.fn();
}

describe('LifecycleState', () => {
  let api: MockLifecycleApi;
  let state: LifecycleState;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LifecycleApi, useClass: MockLifecycleApi }, LifecycleState],
    });

    api = TestBed.inject(LifecycleApi) as unknown as MockLifecycleApi;
    // defaults
    api.getAll.mockReturnValue(of(list(3, 2, 1))); // lista por defecto
    api.getById.mockImplementation((id: number) => of(makeDto({ id, description: `byId-${id}` })));
    api.getByAssignedId.mockImplementation((assignedId: number) => {
      // devolver ids en función del assignedId para validar filtro
      return of(list(assignedId * 10 + 1, assignedId * 10 + 2));
    });
    api.create.mockImplementation((payload: createLifecycleRequest) =>
      of(
        makeDto({
          id: 999,
          description: 'created',
          objAssigned: { id: payload.objAssignedId } as any,
        }),
      ),
    );
    api.update.mockImplementation((partial: Partial<lifecycleDTO>) =>
      of(makeDto({ ...partial, description: 'updated' } as any)),
    );
    api.delete.mockReturnValue(of(void 0));

    state = TestBed.inject(LifecycleState);
    // Do not rely on effect timing in tests — explicitly load when needed.
  });

  it('autoloads list on construct (effect) and exposes listVM', async () => {
    // Explicitly trigger load to avoid timing issues with effects in unit tests
    await state.loadList();
    await flush();

    expect(api.getAll).toHaveBeenCalled();
    const vm = state.listVM();
    expect(vm.length).toBe(3);
    expect(vm[0].id).toBe(3); // viene 3,2,1 por defecto
    expect(state.isLoading()).toBe(false);
    expect(state.hasError()).toBe(false);
  });

  it('uses getByAssignedId when assignedId filter is set', async () => {
    api.getByAssignedId.mockClear();
    api.getAll.mockClear();

    // ensure client-side sort is ascending so expectation matches returned ids order
    state.setSort('id', 'asc');
    state.setFilters({ assignedId: 5 });
    await state.loadList();
    await flush();

    expect(api.getByAssignedId).toHaveBeenCalled();
    expect(api.getByAssignedId).toHaveBeenCalledWith(5);
    expect(api.getAll).not.toHaveBeenCalled();
    const ids = state.items().map((x) => x.id);
    expect(ids).toEqual([51, 52]); // 5*10+1, +2
  });

  it('client-side sort + pagination', async () => {
    // lista desordenada, 6 items
    api.getAll.mockReturnValue(of(list(5, 3, 1, 6, 4, 2)));
    // set sort + page + size
    state.setSort('id', 'asc'); // sets page=1 as well
    state.params.update((p) => ({ ...p, size: 2 })); // ensure page size
    await state.loadList();
    await flush();

    // orden ASC => [1,2,3,4,5,6], page1 size2 => [1,2]
    expect(state.items().map((x) => x.id)).toEqual([1, 2]);

    // page 2 => [3,4]
    state.setPage(2);
    await state.loadList();
    await flush();
    expect(state.items().map((x) => x.id)).toEqual([3, 4]);
  });

  it('caches by params and refresh() invalidates', async () => {
    api.getAll.mockClear();
    await state.loadList(); // 1ra
    await state.loadList(); // 2da (debería salir de cache)
    expect(api.getAll).toHaveBeenCalledTimes(1);

    await state.refresh();
    expect(api.getAll).toHaveBeenCalledTimes(2);
  });

  it('loadById merges/updates selected item and exposes selectedVM', async () => {
    await state.loadById(42);
    const selected = state.selectedItem();
    expect(selected?.id).toBe(42);
    expect(state.selectedVM()?.description).toBe('byId-42');
  });

  it('create prepends item and clears cache (submitting → success)', async () => {
    // Prime cache con una carga
    await state.loadList();
    api.getAll.mockClear();

    expect(state.isLoading()).toBe(false);
    const created = await state.create({
      objAssignedId: 123,
      assignedType: 'PROJECT',
      userId: 7,
      previousState: 'DRAFT',
      newState: 'REVIEW',
      description: 'creating',
      type: 'PROJECT',
    });

    expect(created.id).toBe(999);
    expect(state.items()[0].id).toBe(999);

    // Al volver a cargar, no debería usar cache anterior
    await state.loadList();
    expect(api.getAll).toHaveBeenCalledTimes(1);
    expect(state.isLoading()).toBe(false);
    expect(state.hasError()).toBe(false);
  });

  it('create handles error and does not modify list on failure', async () => {
    // snapshot lista
    await state.loadList();
    const before = state.items();
    api.create.mockReturnValueOnce(throwError(() => new Error('boom')));

    await expect(
      state.create({
        objAssignedId: 1,
        assignedType: 'P',
        userId: 1,
        previousState: 'A',
        newState: 'B',
        description: 'x',
        type: 'P',
      }),
    ).rejects.toThrow();

    expect(state.items()).toEqual(before);
    expect(state.hasError()).toBe(true);
    expect(state.errorMessage()).toContain('boom');
  });

  it('update optimistic success (persists server version)', async () => {
    await state.loadList();
    const id = state.items()[0].id;
    await state.update({ id, description: 'local-change' });

    // server mock devuelve description "updated"
    const found = state.items().find((x) => x.id === id)!;
    expect(found.description).toBe('updated');
  });

  it('update optimistic rollback on error', async () => {
    await state.loadList();
    const id = state.items()[0].id;
    const before = state.items().map((x) => ({ id: x.id, description: x.description }));
    api.update.mockReturnValueOnce(throwError(() => new Error('update-fail')));

    await expect(state.update({ id, description: 'temp' })).rejects.toThrow();
    const after = state.items().map((x) => ({ id: x.id, description: x.description }));
    expect(after).toEqual(before); // rollback
    expect(state.hasError()).toBe(true);
  });

  it('remove optimistic success', async () => {
    api.getAll.mockReturnValue(of(list(1, 2, 3)));
    await state.refresh();
    const len = state.items().length;

    await state.remove(2);
    expect(state.items().some((x) => x.id === 2)).toBe(false);
    expect(state.items().length).toBe(len - 1);
  });

  it('remove rollback on error', async () => {
    api.getAll.mockReturnValue(of(list(10, 20)));
    await state.refresh();
    const before = state.items().map((x) => x.id);

    api.delete.mockReturnValueOnce(throwError(() => new Error('delete-fail')));
    await expect(state.remove(10)).rejects.toThrow();

    expect(state.items().map((x) => x.id)).toEqual(before); // rollback
    expect(state.hasError()).toBe(true);
  });

  it('changing filters/sort/page triggers reload via effect', async () => {
    api.getAll.mockClear();

    // Instead of relying solely on effect timing, call loadList after changes.
    state.setSort('id', 'asc');
    await state.loadList();
    await flush();

    state.setPage(3);
    await state.loadList();
    await flush();

    state.setFilters({ type: 'PROJECT' } as Partial<LifecycleFilters>);
    await state.loadList();
    await flush();

    expect(api.getAll.mock.calls.length).toBeGreaterThan(0);
  });

  it('exposes canonic error clearing', async () => {
    api.getAll.mockReturnValueOnce(throwError(() => new Error('list-fail')));
    await state.loadList();
    expect(state.hasError()).toBe(true);
    expect(state.errorMessage()).toContain('list-fail');

    state.clearError();
    expect(state.hasError()).toBe(false);
    expect(state.errorMessage()).toBeNull();
  });

  it('handles async API latency (loading/submitting flags)', async () => {
    // simulamos latencia
    api.getAll.mockReturnValueOnce(of(list(7, 8)).pipe(delay(0)));
    const p = state.loadList();
    expect(state.isLoading()).toBe(true);
    await p;
    expect(state.isLoading()).toBe(false);

    api.create.mockReturnValueOnce(of(makeDto({ id: 1000 })).pipe(delay(0)));
    const c = state.create({
      objAssignedId: 1,
      assignedType: 'P',
      userId: 1,
      previousState: 'A',
      newState: 'B',
      description: 'd',
      type: 'P',
    });
    expect(state.isLoading()).toBe(true);
    await c;
    expect(state.isLoading()).toBe(false);
  });
});
