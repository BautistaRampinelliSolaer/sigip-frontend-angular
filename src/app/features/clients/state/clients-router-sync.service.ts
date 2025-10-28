import { DestroyRef, effect, inject, Injectable, Injector, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsUiState, DetailKind } from './clients-ui.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class ClientsRouterSyncService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ui = inject(ClientsUiState);
  private readonly dr = inject(DestroyRef);
  private readonly injector = inject(Injector);

  start() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.dr)).subscribe((qp) => {
      const view = (qp.get('view') as DetailKind | null) ?? null;
      const id = qp.get('id') ? Number(qp.get('id')) : null;

      if (!view) {
        this.ui.backToList();
        return;
      }
      if (view === 'company' && id) this.ui.openCompany(id);
      if (view === 'plant' && id) this.ui.openPlant(id);
      if (view === 'contact' && id) this.ui.openContact(id);
    });

    effect(
      () => {
        const view = this.ui.detailKind();
        const id =
          view === 'company'
            ? this.ui.selectedCompanyId()
            : view === 'plant'
              ? this.ui.selectedPlantId()
              : view === 'contact'
                ? this.ui.selectedContactId()
                : null;

        const current = this.route.snapshot.queryParamMap;
        const curView = (current.get('view') as DetailKind | null) ?? null;
        const curId = current.get('id') ? Number(current.get('id')) : null;
        const same = curView === view && curId === id;
        if (same) return;

        untracked(() => {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: view ? { view, id } : { view: null, id: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        });
      },
      { injector: this.injector },
    );
  }
}
