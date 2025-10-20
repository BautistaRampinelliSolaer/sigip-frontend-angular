import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ProjectHoursUiStore } from '../../stores/project-hours-ui.store';
import { ObjectMiniDTO, ProjectMiniDTO } from '@app/domain/models';

@Component({
  selector: 'app-project-hours-form',
  imports: [ReactiveFormsModule],
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
    projectId: this.fb.nonNullable.control<number | null>(null, {
      validators: [Validators.required],
    }),
    userId: this.fb.nonNullable.control<number | null>(null, { validators: [Validators.required] }),
    workDate: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    workedHours: this.fb.nonNullable.control<number>(1, {
      validators: [Validators.required, Validators.min(0.25)],
    }),
    description: this.fb.nonNullable.control<string>(''),
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();
    this.ui.create({
      projectId: Number(raw.projectId),
      userId: Number(raw.userId),
      workDate: raw.workDate,
      workedHours: raw.workedHours,
      description: raw.description,
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
