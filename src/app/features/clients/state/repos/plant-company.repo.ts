import { computed, inject, Injectable, signal } from "@angular/core";
import { EntityStore } from "../_shared/entity-store";
import { CreatePlantCompanyRequest, PlantCompanyDTO } from "@app/domain/models";
import { PlantCompanyApi } from "@app/infrastructure/api";
import { RequestMeta, TTL_5_MINUTES } from "../_shared/request-state";


@Injectable({ providedIn: 'root' })
export class PlantCompanyRepo extends EntityStore<PlantCompanyDTO> {
  private readonly api = inject(PlantCompanyApi);
  readonly meta = signal<RequestMeta>({ status: 'idle', error: null, staleAt: null });

  // selectores útiles
  byCompanyId = (companyId: number) =>
    computed(() => this.all().filter(p => p.company?.id === companyId));

  loadAll(force = false) {
    const now = Date.now();
    const isStale = !this.meta().staleAt || this.meta().staleAt! <= now;
    if (!force && this.meta().status === 'success' && !isStale) return;

    this.meta.set({ status: 'loading', error: null, staleAt: this.meta().staleAt });
    this.api.listAll().subscribe({
      next: list => { this.replaceAll(list); this.meta.set({ status: 'success', error: null, staleAt: now + TTL_5_MINUTES }); },
      error: err => this.meta.set({ status: 'error', error: err?.message ?? 'Error', staleAt: null }),
    });
  }

  create(dto: CreatePlantCompanyRequest) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.create(dto).subscribe({
      next: item => { this.upsertOne(item); this.meta.set({ ...this.meta(), status: 'success' }); },
      error: err => this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }

  update(id: number, dto: Partial<CreatePlantCompanyRequest>) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.update(id, dto).subscribe({
      next: item => { this.upsertOne(item); this.meta.set({ ...this.meta(), status: 'success' }); },
      error: err => this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }

  delete(id: number) {
    this.meta.set({ ...this.meta(), status: 'loading', error: null });
    this.api.delete(id).subscribe({
      next: () => { this.remove(id); this.meta.set({ ...this.meta(), status: 'success' }); },
      error: err => this.meta.set({ ...this.meta(), status: 'error', error: err?.message ?? 'Error' }),
    });
  }
}