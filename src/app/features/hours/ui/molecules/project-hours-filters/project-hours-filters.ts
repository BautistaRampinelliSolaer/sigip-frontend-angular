import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-project-hours-filters',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatLabel,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-hours-filters.html',
  styleUrl: './project-hours-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-filters' },
})
export class ProjectHoursFilters {
  private readonly ui = inject(ProjectHoursUiStore);

  projects = input<ProjectMiniDTO[]>([]);
  users = input<ObjectMiniDTO[]>([]);

  q = signal(this.ui.search());
  from = signal(this.ui.dateFrom());
  to = signal(this.ui.dateTo());

  readonly selectedProjectId = computed(() => this.ui.projectId());
  readonly selectedUserId = computed(() => this.ui.userId());

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
  setProject(value: number | null) {
    this.ui.setProject(value);
  }
  setUser(value: number | null) {
    this.ui.setUser(value);
  }
}
