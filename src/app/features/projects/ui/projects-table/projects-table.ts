import { Component, computed, inject } from '@angular/core';
import { Key, ProjectsColumnsStore } from '../projects-columns.store';
import { ProjectState } from '../../state/project-state';
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckbox } from "@angular/material/checkbox";
import { DataTable } from "@app/shared/ui";
import { MatButton } from '@angular/material/button';
import { ProjectDTO } from '@app/domain/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-table',
  imports: [MatButton, MatMenuModule, MatIconModule, MatCheckbox, DataTable],
  templateUrl: './projects-table.html',
  styleUrl: './projects-table.scss',
})
export class ProjectsTable {
  private readonly cols = inject(ProjectsColumnsStore);
  private readonly store = inject(ProjectState);
  private readonly router = inject(Router);

  readonly columns = this.cols.visible;
  readonly allColumns = this.cols.all;
  readonly selectedKeys = this.cols.selectedKeys;

  readonly data = computed(() => this.store.projects());
  readonly loading = computed(() => this.store.loadingList());
  readonly error = computed(() => this.store.listError());

  toggleKey(key: Key) {
    const set = new Set(this.selectedKeys());
    set.has(key) ? set.delete(key) : set.add(key);
    this.cols.setSelected(Array.from(set));
  }

  openDetail(project: ProjectDTO) {
    this.router.navigate([`projects/${project.id}`]);
  }
}
