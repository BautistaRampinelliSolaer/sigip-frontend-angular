import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { createLifecycleRequest, lifecycleDTO } from '@app/domain/models';
import { LifecycleApi } from '@app/infrastructure/api/projects/lifecycle/lifecycle.api';
import { normalizeError } from '@app/shared/helpers/normalize-error';
import { firstValueFrom } from 'rxjs';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

type SortDir = 'asc' | 'desc';

export type LifecycleFilters = {
  assignedId?: number | null;
  assignedType?: string | null;
};

export type LifecycleListParams = {
  page: number;
  size: number;
  sort?: { field: keyof lifecycleDTO; dir: SortDir };
  filters: LifecycleFilters;
};

type CacheEntry = {
  data: lifecycleDTO[];
  total: number;
  at: number;
};

@Injectable({
  providedIn: 'root',
})
export class LifecycleState {
  private readonly api = inject(LifecycleApi);

  // Base state
  private readonly _items = signal<lifecycleDTO[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _selectedId = signal<number | null>(null);
  private readonly _status = signal<RequestStatus>('idle');
  private readonly _error = signal<string | null>(null);

  // list params
  readonly params = signal<LifecycleListParams>({
    page: 1,
    size: 25,
    sort: { field: 'id', dir: 'desc' },
    filters: { assignedId: null, assignedType: null },
  });

  // Cache by params
  private readonly cache = new Map<string, CacheEntry>();

  // Derived
  readonly isLoading = computed(() => this._status() === 'loading');
  // readonly isSubmitting = computed(() => this._status() === 'submitting');
  readonly hasError = computed(() => this._status() === 'error');
  readonly errorMessage = computed(() => this._error());
  readonly total = computed(() => this._total());
  readonly items = computed(() => this._items());

  // View Models
  readonly listVM = computed(() =>
    this._items().map((it) => ({
      id: it.id,
      assignedName: it.objAssigned.name,
      assignedId: it.objAssigned.id,
      assignedType: it.objAssigned.type,
      previousState: it.previousState,
      nextState: it.newState,
      type: it.type,
      description: it.description,
    })),
  );

  readonly selectedItem = computed(() => {
    const id = this._selectedId();
    return id == null ? null : (this._items().find((x) => x.id === id) ?? null);
  });

  readonly selectedVM = computed(() => {
    const d = this.selectedItem();
    return d
      ? {
          id: d.id,
          assignedName: d.objAssigned.name,
          assignedId: d.objAssigned.id,
          assignedType: d.objAssigned.type,
          previous: d.previousState,
          next: d.newState,
          type: d.type,
          description: d.description,
          raw: d,
        }
      : null;
  });

  constructor() {
    effect(() => {
      void this.loadList();
    });
  }

  // **************************
  // Public API for Views
  // **************************

  setFilters(filters: Partial<LifecycleFilters>) {
    this.params.update((p) => ({ ...p, page: 1, filters: { ...p.filters, ...filters } }));
  }

  clearFilters() {
    this.params.update((p) => ({
      ...p,
      page: 1,
      filters: { assignedId: null, assignedType: null },
    }));
  }

  setSort(field: keyof lifecycleDTO, dir: SortDir) {
    this.params.update((p) => ({ ...p, page: 1, sort: { field, dir } }));
  }

  setPage(page: number) {
    this.params.update((p) => ({ ...p, page }));
  }

  select(id: number | null) {
    this._selectedId.set(id);
  }

  clearError() {
    this._error.set(null);
    this._status.set('idle');
  }

  // Helpers

  private keyFromParams(p: LifecycleListParams) {
    return JSON.stringify({
      page: p.page,
      size: p.size,
      sort: p.sort,
      filters: p.filters,
    });
  }

  private normalizeError(e: unknown) {
    return (e as { message?: string })?.message ?? 'Error inesperado';
  }

  // ---- Loads

  async loadList(): Promise<void> {
    const key = this.keyFromParams(this.params());
    const cached = this.cache.get(key);
    if (cached) {
      this._items.set(cached.data);
      this._total.set(cached.total);
      this._status.set('success');
      return;
    }

    this._status.set('loading');
    this._error.set(null);

    try {
      const { filters } = this.params();
      let data: lifecycleDTO[];

      if (filters.assignedId != null && filters.assignedId !== undefined) {
        data = await firstValueFrom(this.api.getByAssignedId(filters.assignedId));
      } else {
        data = await firstValueFrom(this.api.getAll());
      }

      const { sort, page, size } = this.params();
      const sorted = sort
        ? [...data].sort((a, b) => {
            const fa = a[sort.field];
            const fb = b[sort.field];
            if (fa === fb) return 0;
            const cmp = fa < fb ? -1 : 1;
            return sort.dir === 'asc' ? cmp : -cmp;
          })
        : data;

      const start = (page - 1) * size;
      const paged = sorted.slice(start, start + size);

      this._items.set(paged);
      this._total.set(sorted.length);

      this.cache.set(key, { data: paged, total: sorted.length, at: Date.now() });
      this._status.set('success');
    } catch (e: unknown) {
      this._status.set('error');
      this._error.set(normalizeError(e));
    }
  }

  async loadById(id: number): Promise<void> {
    this._status.set('loading');
    this._error.set(null);

    try {
      const dto = await firstValueFrom(this.api.getById(id));
      this._items.update((list) => {
        const i = list.findIndex((x) => x.id === id);
        return i >= 0 ? list.with(i, dto) : [dto, ...list];
      });
      this._selectedId.set(id);
      this._status.set('success');
    } catch (e: unknown) {
      this._status.set('error');
      this._error.set(this.normalizeError(e));
    }
  }

  async create(payload: createLifecycleRequest): Promise<lifecycleDTO> {
    this._status.set('loading');
    this._error.set(null);

    try {
      const created = await firstValueFrom(this.api.create(payload));
      // Optimistic
      this._items.update((list) => [created, ...list]);
      this.invalidateCache();
      this._status.set('success');
      return created;
    } catch (e: unknown) {
      this._status.set('error');
      this._error.set(normalizeError(e));
      throw e;
    }
  }

  async update(updated: Partial<lifecycleDTO> & Pick<lifecycleDTO, 'id'>): Promise<lifecycleDTO> {
    this._status.set('loading');
    this._error.set(null);

    const prev = this._items();
    const idx = prev.findIndex((x) => x.id === updated.id);
    if (idx >= 0) {
      this._items.set(prev.with(idx, { ...prev[idx], ...updated }));
    }

    try {
      const dto = await firstValueFrom(this.api.update(updated));
      if (idx >= 0) this._items.update((list) => list.with(idx, dto));
      this.invalidateCache();
      this._status.set('success');
      return dto;
    } catch (e: unknown) {
      this._items.set(prev);
      this._status.set('error');
      this._error.set(this.normalizeError(e));
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    const prev = this._items();
    this._items.set(prev.filter((x) => x.id !== id));
    try {
      await firstValueFrom(this.api.delete(id));
      if (this._selectedId() === id) this._selectedId.set(null);
      this.invalidateCache();
    } catch (e: unknown) {
      this._items.set(prev);
      this._status.set('error');
      this._error.set(this.normalizeError(e));
      throw e;
    }
  }

  refresh() {
    this.cache.clear();
    return this.loadList();
  }

  invalidateCache() {
    this.cache.clear();
  }
}
