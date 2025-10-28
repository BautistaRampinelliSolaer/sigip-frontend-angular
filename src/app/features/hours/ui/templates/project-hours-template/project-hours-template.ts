import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';
import { ProjectHoursTable } from '../../organisms/project-hours-table/project-hours-table';
import { ProjectHoursFilters } from '../../molecules/project-hours-filters/project-hours-filters';
import { ProjectHoursForm } from '../../organisms/project-hours-form/project-hours-form';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-project-hours-template',
  imports: [
    MatCardModule,
    MatDividerModule,
    ProjectHoursTable,
    ProjectHoursFilters,
    ProjectHoursForm,
  ],
  templateUrl: './project-hours-template.html',
  styleUrl: './project-hours-template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-template' },
})
export class ProjectHoursTemplate {
  projects = input<ProjectMiniDTO[]>([]);
  users = input<ObjectMiniDTO[]>([]);
}
