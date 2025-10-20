import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';

@Component({
  selector: 'app-project-hours-filters',
  imports: [],
  templateUrl: './project-hours-filters.html',
  styleUrl: './project-hours-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-filters' },
})
export class ProjectHoursFilters {
  private readonly ui = inject(ProjectHoursUiStore);

  // Optional inputs
  projects = input<ProjectMiniDTO[]>([]);
  users = input<ObjectMiniDTO[]>([]);

  q = signal(this.ui.search());
  from = signal(this.ui.dateFrom());
  to = signal(this.ui.dateTo());

  // helpers
  readonly selectedProjectId = computed(() => this.ui.projectId());
  readonly selectedUserId = computed(() => this.ui.userId());

  // actions
  applySearch() {
    this.ui.setSearch(this.q().trim());
  }
  applyDates() {
    this.ui.setDates(this.from(), this.to());
  }
  clearDates() {
    this.from.set(null);
    this.to.set(null);
    this.applyDates();
  }

  setProject(value: string) {
    this.ui.setProject(value ? Number(value) : null);
  }
  setUser(value: string) {
    this.ui.setUser(value ? Number(value) : null);
  }
}
