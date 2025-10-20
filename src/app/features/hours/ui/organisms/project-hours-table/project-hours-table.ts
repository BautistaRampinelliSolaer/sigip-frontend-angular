import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ProjectHoursState } from '@app/features/hours/data/state/project-hours.state';

@Component({
  selector: 'app-project-hours-table',
  imports: [],
  templateUrl: './project-hours-table.html',
  styleUrl: './project-hours-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-table'}
})
export class ProjectHoursTable {
  readonly ui = inject(ProjectHoursUiStore);
  readonly data = inject(ProjectHoursState);

  toggleSort(field: 'workDate'|'workedHours') {
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
    const newIndex = Math.max(this.ui.pageCount() - 1, this.ui.pageIndex() + 1);
    this.ui.setPage(newIndex);
  }
}
