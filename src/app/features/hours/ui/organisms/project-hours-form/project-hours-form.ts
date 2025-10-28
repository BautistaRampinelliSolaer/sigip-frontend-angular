import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-project-hours-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-hours-form.html',
  styleUrl: './project-hours-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ph-form' },
})
export class ProjectHoursForm {
  private readonly fb = inject(FormBuilder);
  private readonly ui = inject(ProjectHoursUiStore);

  projects = input<ProjectMiniDTO[]>([]);
  users = input<ObjectMiniDTO[]>([]);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    projectId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    userId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    workDate: this.fb.control<string>('', { validators: [Validators.required] }),
    workedHours: this.fb.control<number>(1, {
      validators: [Validators.required, Validators.min(0.25)],
    }),
    description: this.fb.control<string>(''),
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    this.ui.create({
      projectId: Number(raw.projectId),
      userId: Number(raw.userId),
      workDate: raw.workDate ?? '',
      workedHours: raw.workedHours ?? 0,
      description: raw.description ?? '',
    });

    this.form.patchValue(
      {
        workDate: '',
        workedHours: 1,
        description: '',
        projectId: this.ui.projectId(),
        userId: this.ui.userId(),
      },
      { emitEvent: false },
    );
    this.submitting.set(false);
  }
}
