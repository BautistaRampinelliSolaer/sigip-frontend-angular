import { Component, computed, input, output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ErrorState, Skeleton, EmptyState } from '../..';

export type ColumnDef<T> = {
  key: keyof T & string;
  header: string;
  cell?: (row: T) => string | number;
  stickyStart?: boolean;
  stickyEnd?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    Skeleton,
    ErrorState,
    EmptyState
],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable {
  columns = input.required<ColumnDef<any>[]>();
  data = input<any[]>([]);
  loading = input<boolean>(false);
  error = input<string | null>(null);
  emptyTitle = input<string>('No hay datos disponibles');
  emptyMessage = input<string>('Ajustá los filtros o carga información');

  displayedColumns = computed(() => this.columns().map(c => c.key));

  rowClick = output<any>();
}
