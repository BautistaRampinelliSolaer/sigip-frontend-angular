import { computed, inject, Injectable, signal } from '@angular/core';
import { BrowserStorage } from '@app/core/storage/storage';
import { ProjectDTO } from '@app/domain/models';
import { ColumnDef } from '@app/shared/ui';

export type Key = keyof ProjectDTO & string;

@Injectable({
  providedIn: 'root',
})
export class ProjectsColumnsStore {
  private readonly storage = inject(BrowserStorage);
  private readonly STORAGE_KEY = 'projects.columns';

  readonly all: ColumnDef<ProjectDTO>[] = [
    { key: 'code', header: 'Código', stickyStart: true },
    { key: 'name', header: 'Proyecto' },
    { key: 'state', header: 'Estado' },
    { key: 'company', header: 'Empresa', cell: (r) => r.company?.name ?? '' },
    { key: 'responsible', header: 'Responsable', cell: (r) => r.responsible?.name ?? '' },
    {
      key: 'creationDate',
      header: 'Creación',
      cell: (r) => new Date(r.creationDate).toLocaleDateString(),
    },
  ];

  private load(): Key[] {
    const raw = this.storage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Key[];
      } catch {
        /* Ignore */
      }
    }
    return ['code', 'name', 'state'];
  }

  private readonly _selectedKeys = signal<Key[]>(this.load());
  readonly selectedKeys = computed(() => this._selectedKeys());

  readonly visible = computed<ColumnDef<ProjectDTO>[]>(() => {
    const keys = new Set(this._selectedKeys());
    return this.all.filter((c) => keys.has(c.key));
  });

  setSelected(keys: Key[]) {
    this._selectedKeys.set(keys);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
  }
}
