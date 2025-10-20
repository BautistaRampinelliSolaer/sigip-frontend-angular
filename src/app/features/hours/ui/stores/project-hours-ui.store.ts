import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ProjectHoursState } from '../../data/state/project-hours.state';

export type SortField = 'workDate' | 'workedHours';
export type SortDir = 'asc' | 'desc';

@Injectable({
  providedIn: 'root',
})
export class ProjectHoursUiStore {
  private readonly data = inject(ProjectHoursState);

  // --- UI State ---
  readonly projectId = signal<number | null>(null);
  readonly userId = signal<number | null>(null);
  readonly dateFrom = signal<string | null>(null); // YYYY-MM-DD
  readonly dateTo = signal<string | null>(null); // YYYY-MM-DD
  readonly search = signal(''); // search in description
  readonly sortField = signal<SortField>('workDate');
  readonly sortDir = signal<SortDir>('desc');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly selectedId = signal<number | null>(null);

  // --- effect: automatic load by high level filters
  private readonly _autoLoad = effect(() => {
    const p = this.projectId();
    const u = this.userId();

    if (p != null) {
      this.data.loadByProject(p);
    } else if (u != null) {
      this.data.loadByUser(u);
    } else {
      this.data.loadAll();
    }

    this.pageIndex.set(0);
  });

  // --- intern helpers
  private compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  readonly filtered = computed(() => {
    const list = this.data.items();
    const p = this.projectId();
    const u = this.userId();
    const q = this.search().trim().toLowerCase();
    const from = this.dateFrom();
    const to = this.dateTo();

    return list
      .filter((it) => {
        if (p != null && it.project.id !== p) return false;
        if (u != null && it.user.id !== u) return false;

        if (from && it.workDate < from) return false;
        if (to && it.workDate > to) return false;

        if (q) {
          const haystack = `${it.description} ${it.project.name} ${it.user.name}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const field = this.sortField();
        const dir = this.sortDir();
        const av = field === 'workDate' ? a.workDate : a.workedHours;
        const bv = field === 'workDate' ? b.workDate : b.workedHours;
        const cmp = this.compare(av, bv);
        return dir === 'asc' ? cmp : -cmp;
      });
  });

  readonly totalHoursFiltered = computed(() =>
    this.filtered().reduce((acc, it) => acc + it.workedHours, 0),
  );

  readonly paged = computed(() => {
    const list = this.filtered();
    const size = this.pageSize();
    const idx = this.pageIndex();
    const start = idx * size;
    return list.slice(start, start + size);
  });

  readonly pageCount = computed(() => {
    const total = this.filtered().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  readonly groupByDay = computed(() => {
    const map = new Map<string, number>();
    for (const it of this.filtered()) {
      map.set(it.workDate, (map.get(it.workDate) ?? 0) + it.workedHours);
    }

    return Array.from(map.entries())
      .sort((a, b) => this.compare(a[0], b[0]))
      .map(([date, hours]) => ({ date, hours }));
  });

  // --- UI Actions ---
  setProject(id: number | null) {
    this.projectId.set(id);
  }
  setUser(id: number | null) {
    this.userId.set(id);
  }
  setDates(from: string | null, to: string | null) {
    this.dateFrom.set(from);
    this.dateTo.set(to);
  }
  setSearch(q: string) {
    this.search.set(q);
  }
  setSort(field: SortField, dir: SortDir) {
    this.sortField.set(field);
    this.sortDir.set(dir);
  }
  setPage(index: number) {
    this.pageIndex.set(index);
  }
  setPageSize(size: number) {
    this.pageSize.set(size);
  }
  select(id: number | null) {
    this.selectedId.set(id);
  }

  create(dto: Parameters<ProjectHoursState['create']>[0]) {
    this.data.create(dto);
  }

  delete(id: number) {
    if (this.selectedId() === id) this.selectedId.set(null);
    this.data.delete(id);
  }
}
