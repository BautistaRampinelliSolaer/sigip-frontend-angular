import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ProjectState } from '../../state/project-state';
import { Filters, ProjectsFilters } from '../projects-filters/projects-filters';
import { ProjectsTable } from "../projects-table/projects-table";

@Component({
  selector: 'projects-page',
  imports: [ProjectsFilters, ProjectsTable],
  templateUrl: './projects-page.html',
  styleUrls: ['./projects-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPage implements OnInit {
  readonly store = inject(ProjectState);

  ngOnInit() {
    this.store.loadList();
  }

  onApplyFilters(f: Filters) {
    this.store.setFilters(f);
  }
}
