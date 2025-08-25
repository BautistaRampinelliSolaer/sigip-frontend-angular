import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ProjectState } from '../state/project-state';
import { Header } from '@app/shared/ui/molecules/header/header';

@Component({
  selector: 'app-project-create',
  imports: [
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './project-create.html',
  styleUrl: './project-create.scss'
})
export class ProjectCreate {
  private readonly fb = inject(FormBuilder);
  private readonly state = inject(ProjectState);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    standards: ['', Validators.required],
    state: ['DRAFT', Validators.required],
    type: ['SOFTWARE', Validators.required],
    responsibleId: [1, Validators.required],
    reviewerId: [1, Validators.required],
  })

  submit(): void {
    if (this.form.invalid) return;
    this.state.createProject(this.form.getRawValue());
    this.router.navigateByUrl('/projects');
  }
}
