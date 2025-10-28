import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ProjectHoursState } from '@app/features/hours/data/state/project-hours.state';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { EmptyState, ErrorState, Skeleton } from '@app/shared/ui';


@Component({
  selector: 'app-project-hours-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    Skeleton,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './project-hours-table.html',
  styleUrl: './project-hours-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-table' },
})
export class ProjectHoursTable {
  readonly ui = inject(ProjectHoursUiStore);
  readonly data = inject(ProjectHoursState);

  toggleSort(field: 'workDate' | 'workedHours') {
    const nextDir = this.ui.sortDir() === 'asc' ? 'desc' : 'asc';
    this.ui.setSort(field, nextDir);
  }

  delete(id: number) {
    if (confirm('¿Eliminar el registro?')) this.ui.delete(id);
  }

  prevPage() {
    const newIndex = Math.max(0, this.ui.pageIndex() - 1);
    this.ui.setPage(newIndex);
  }

  nextPage() {
    const newIndex = Math.min(this.ui.pageCount() - 1, this.ui.pageIndex() + 1);
    this.ui.setPage(newIndex);
  }
}
