import { Component, signal } from '@angular/core';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';
import { ProjectHoursTemplate } from '../../templates/project-hours-template/project-hours-template';

@Component({
  selector: 'app-project-hours-page',
  imports: [ProjectHoursTemplate],
  templateUrl: './project-hours-page.html',
  styleUrl: './project-hours-page.scss',
})
export class ProjectHoursPage {
  // --- Manage the Real DATA --- //

  readonly projects = signal<ProjectMiniDTO[]>([
    { id: 1, name: 'SIGIP – Core' },
    { id: 2, name: 'SIGIP – UI/UX' },
  ]);
  readonly users = signal<ObjectMiniDTO[]>([
    { id: 1, name: 'Ana', type: 'user' },
    { id: 2, name: 'Carlos', type: 'user' },
  ]);
}
