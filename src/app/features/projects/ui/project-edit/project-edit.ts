import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectState } from '../../state/project-state';
import { Skeleton, ErrorState } from '@app/shared/ui';
import { ProjectForm } from '../project-form/project-form';

@Component({
  selector: 'app-project-edit',
  imports: [Skeleton, ErrorState, ProjectForm],
  templateUrl: './project-edit.html',
  styleUrl: './project-edit.scss',
})
export class ProjectEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProjectState);

  readonly id = computed(() => Number(this.route.snapshot.paramMap.get('id')));
  readonly project = computed(() => this.store.entityById(this.id()));
  readonly loading = computed(() => this.store.entityLoading(this.id()));
  readonly error = computed(() => this.store.entityError(this.id()));

  constructor() {
    if (!this.project()) this.store.loadById(this.id());
  }

  reload() {
    this.store.loadById(this.id());
  }
  save(partial: any) {
    this.store.edit(this.id(), partial).then(() => this.router.navigate(['/projects', this.id()]));
  }
  back() {
    this.router.navigate(['/projects']);
  }
}
