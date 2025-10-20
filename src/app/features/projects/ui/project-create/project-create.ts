import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectState } from '../../state/project-state';
import { Router } from '@angular/router';
import { ProjectForm } from '../project-form/project-form';

@Component({
  selector: 'app-project-create',
  imports: [ProjectForm],
  templateUrl: './project-create.html',
  styleUrl: './project-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCreate {
  private readonly store = inject(ProjectState);
  private readonly router = inject(Router);

  save(dto: any) {
    this.store.create(1, dto).then((newId) => this.router.navigate(['/projects', newId]));
  }

  back() {
    this.router.navigate(['/projects']);
  }
}
