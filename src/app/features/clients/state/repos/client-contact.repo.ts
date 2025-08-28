import { computed, inject, Injectable, signal } from '@angular/core';
import { EntityStore } from '../_shared/entity-store';
import { ClientContactDTO, CreateClientContactRequest } from '@app/domain/models';
import { ClientContactApi } from '@app/infrastructure/api';
import { RequestMeta, TTL_5_MINUTES } from '../_shared/request-state';

@Injectable({ providedIn: 'root' })
export class ClientContactRepo extends EntityStore<ClientContactDTO> {
  private readonly api = inject(ClientContactApi);
  readonly meta = signal<RequestMeta>({ status: 'idle', error: null, staleAt: null });

  filtered = (opts: { companyId?: number | null; plantId?: number | null }) =>
    computed(() => {
      let list = this.all();
      if (opts.companyId) list = list.filter((c) => c.company?.id === opts.companyId);
      if (opts.plantId) list = list.filter((c) => c.plantCompany?.id === opts.plantId);
      return list;
    });

  loadAll(force = false) {
    const now = Date.now();
    const isStale = !this.meta().staleAt || this.meta().staleAt! <= now;
    if (!force && this.meta().status === 'success' && !isStale) return;

    this.meta.set({ status: 'loading', error: null, staleAt: this.meta().staleAt });
    this.api.listAll().subscribe({
      next: (list) => {
        this.replaceAll(list);
        this.meta.set({ status: 'success', error: null, staleAt: now + TTL_5_MINUTES });
      },
      error: (err) =>
        this.meta.set({ status: 'error', error: err?.message ?? 'Error', staleAt: null }),
    });
  }

  create(dto: CreateClientContactRequest) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.create(dto).subscribe({
      next: (item) => {
        this.upsertOne(item);
        this.meta.set({ ...this.meta(), status: 'success' });
      },
      error: (err) =>
        this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }

  update(id: number, dto: Partial<CreateClientContactRequest>) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.update(id, dto).subscribe({
      next: (item) => {
        this.upsertOne(item);
        this.meta.set({ ...this.meta(), status: 'success' });
      },
      error: (err) =>
        this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }

  delete(id: number) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.delete(id).subscribe({
      next: () => {
        this.remove(id);
        this.meta.set({ ...this.meta(), status: 'success' });
      },
      error: (err) =>
        this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }
}
