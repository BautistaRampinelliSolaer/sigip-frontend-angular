import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { ColumnDef } from '../../models/data-grid';
import { Sort, MatSortModule } from '@angular/material/sort';
import { TableToolbar } from '../../molecules/table-toolbar/table-toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { TableCell } from '../../atoms/table-cell/table-cell';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-data-grid',
  imports: [
    TableToolbar,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TableCell,
    MatSortModule,
    NgTemplateOutlet,
  ],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-data-grid block' },
})
export class DataGrid<T extends { id?: number | string }> {
  // Inputs (signals)
  data = input.required<T[]>();
  columns = input.required<ColumnDef<T>[]>();
  detailTemplate = input<TemplateRef<{ $implicit: T }>>();

  // Outputs
  rowClick = output<T>();

  // State
  readonly hidden = signal<Set<string>>(new Set());
  readonly colOrder = signal<string[]>([]);
  readonly query = signal('');
  readonly sortState = signal<Sort | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly expandedKey = signal<string | number | null>(null);

  constructor() {
    effect(() => {
      if (!this.colOrder().length) this.colOrder.set(this.columns().map((c) => c.id));
    });
  }

  // Derivadas
  readonly orderedCols = computed(() => {
    const byId = new Map(this.columns().map((c) => [c.id, c]));
    return this.colOrder()
      .map((id) => byId.get(id)!)
      .filter(Boolean);
  });

  readonly visibleCols = computed(() => this.orderedCols().filter((c) => !this.hidden().has(c.id)));
  readonly headerColumns = computed(() => this.visibleCols().map((c) => c.id));

readonly displayedColumns = computed(() => {
  const base = this.headerColumns();
  const cols = this.detailTemplate() ? [...base, '_exp'] : base;
  // defensivo: eliminar duplicados si algún día se repite
  return Array.from(new Set(cols));
});

  readonly filteredSorted = computed(() => {
    const q = this.query().toLowerCase().trim();
    const cols = this.columns();
    let rows = this.data().filter(
      (r) =>
        !q ||
        cols.some((c) =>
          String(c.accessor(r) ?? '')
            .toLowerCase()
            .includes(q),
        ),
    );

    const s = this.sortState();
    if (s && s.direction) {
      const col = cols.find((c) => c.id === s.active);
      if (col) {
        const dir = s.direction === 'asc' ? 1 : -1;
        rows = [...rows].sort((a, b) => {
          const va = col.accessor(a);
          const vb = col.accessor(b);
          const na = typeof va === 'number' ? va : Number.NaN;
          const nb = typeof vb === 'number' ? vb : Number.NaN;
          if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
          return String(va ?? '').localeCompare(String(vb ?? '')) * dir;
        });
      }
    }
    return rows;
  });

  readonly paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredSorted().slice(start, start + this.pageSize());
  });
  

  // predicado para el row de DETALLE (usa lógica actual de expanded)
  readonly rowIsDetail = (_index: number, row: T) => this.isExpanded(row);
  readonly rowIsData = (_index: number, row: T) => !this.isExpanded(row);

  // UI handlers
  toggleColumn(id: string) {
    const s = new Set(this.hidden());
    s.has(id) ? s.delete(id) : s.add(id);
    this.hidden.set(s);
  }
  drop(ev: CdkDragDrop<string[]>) {
    const order = [...this.colOrder()];
    moveItemInArray(order, ev.previousIndex, ev.currentIndex);
    this.colOrder.set(order);
  }
  onSort(ev: Sort) {
    this.sortState.set(ev.direction ? ev : null);
  }
  onPage(ev: PageEvent) {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  toggleExpand(row: T) {
    const key = row.id ?? JSON.stringify(row);
    this.expandedKey.set(this.expandedKey() === key ? null : key);
  }
  isExpanded(row: T) {
    const key = row.id ?? JSON.stringify(row);
    return this.expandedKey() === key;
  }
}
