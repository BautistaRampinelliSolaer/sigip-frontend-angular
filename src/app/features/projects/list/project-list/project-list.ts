import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Header } from '@app/shared/ui/molecules/header/header';
import { ProjectState } from '../../state/project-state';

@Component({
  selector: 'app-project-list',
  imports: [
    MatTableModule,  
    ReactiveFormsModule, 
    RouterLink,
    Header
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectListPage {
  readonly state = inject(ProjectState);
  readonly search = new FormControl('', { nonNullable: true });
  readonly cols = ['code', 'name'];

  ngOnInit(): void {
    this.state.loadAll();
    this.search.valueChanges.subscribe(v => this.state.setQuery(v));
  }
}
