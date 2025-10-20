import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectState } from '../../state/project-state';
import { Skeleton, ErrorState } from '@app/shared/ui';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'project-detail-page',
  imports: [Skeleton, ErrorState, DatePipe],
  templateUrl: './project-detail-page.html',
  styleUrls: ['./project-detail-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(ProjectState);

  readonly id = computed(() => Number(this.route.snapshot.paramMap.get('id')));
  readonly project = computed(() => this.store.entityById(this.id()));
  readonly loading = computed(() => this.store.entityLoading(this.id()));
  readonly error = computed(() => this.store.entityError(this.id()));

  constructor() {
    if (!this.store.entityById(this.id())) {
      this.store.loadById(this.id());
    }
  }

  back() {
    this.router.navigate(['/projects']);
  }
  edit() {
    this.router.navigate(['/projects', this.id(), 'edit']);
  }
}
