import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CreateUserRequest, UserDTO } from '@app/domain/models';
import { RequestStatus } from '@app/features/clients/state/_shared/request-state';
import { UsersApi } from '@app/infrastructure/api/users/users.api';
import { normalizeError } from '@app/shared/helpers/normalize-error';
import { firstValueFrom } from 'rxjs';

// types for filters/order

@Injectable({
  providedIn: 'root',
})
export class UsersState {
  private readonly api = inject(UsersApi);

  // Base state
  private readonly _users = signal<UserDTO[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _selectedId = signal<number | null>(null);
  private readonly _status = signal<RequestStatus>('idle');
  private readonly _error = signal<string | null>(null);

  // list params
  //
  //
  //
  //

  // private readonly cache = new Map<string, CacheEntry>();

  readonly isLoading = computed(() => this._status() === 'loading');
  readonly hasError = computed(() => this._status() === 'error');
  readonly errorMessage = computed(() => this._error());
  readonly total = computed(() => this._total());
  readonly users = computed(() => this._users());

  readonly selectedUser = computed(() => {
    const id = this._selectedId();
    return id == null ? null : (this._users().find((x) => x.id === id) ?? null);
  });

  //   readonly selectedViewModel

  constructor() {
    effect(() => {
      this.loadList();
    });
  }

  async loadList(): Promise<void> {
    //
    // CACHE management
    //

    this._status.set('loading');
    this._error.set(null);

    try {
      let data: UserDTO[];

      data = await firstValueFrom(this.api.getAll());

      this._users.set(data);
      this._total.set(data.length);

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
      this._users.update((list) => {
        const i = list.findIndex((x) => x.id === id);
        return i >= 0 ? list.with(i, dto) : [dto, ...list];
      });
      this._selectedId.set(id);
      this._status.set('success');
    } catch (e: unknown) {
      this._status.set('error');
      this._error.set(normalizeError(e));
    }
  }

  async create(payload: CreateUserRequest): Promise<UserDTO> {
    this._status.set('loading');
    this._error.set(null);

    try {
      const created = await firstValueFrom(this.api.create(payload));
      this._users.update((list) => [created, ...list]);
      this._status.set('success');
      return created;
    } catch (e: unknown) {
      this._status.set('error');
      this._error.set(normalizeError(e));
      throw e;
    }
  }

  // async update(updated: Partial<UserDTO> & Pick<UserDTO, 'id'>): Promise<UserDTO> {
  //   this._status.set('loading');
  //   this._error.set(null);

  //   const prev = this._users();
  //   const idx = prev.findIndex((x) => x.id === updated.id);
  //   if (idx >= 0) {
  //     this._users.set(prev.with(idx, { ...prev[idx], ...updated }));
  //   }

  //   try {
  //     const dto = await firstValueFrom(this.api)
  //     this._status.set('success');
  //     return;
  //   } catch (e: unknown) {
  //     this._users.set(prev);
  //     this._status.set('error');
  //     this._error.set(normalizeError(e));
  //     throw e;
  //   }
  // }

  async remove(id: number): Promise<void> {
    const prev = this._users();
    this._users.set(prev.filter((x) => x.id !== id));
    try {
      await firstValueFrom(this.api.delete(id));
      if (this._selectedId() === id) this._selectedId.set(null);
    } catch (e: unknown) {
      this._users.set(prev);
      this._status.set('error');
      this._error.set(normalizeError(e));
    }
  }
}
