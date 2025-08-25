import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '@app/core/auth/auth.service';
import { HoursApi } from '@app/infrastructure/api';
import { Header } from '@app/shared/ui/molecules/header/header';

@Component({
  selector: 'app-hours-page',
  imports: [ReactiveFormsModule, MatTableModule, Header],
  templateUrl: './hours-page.html',
  styleUrl: './hours-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoursPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(HoursApi);
  private readonly auth = inject(AuthService);

  rows = signal<any[]>([]);
  cols = ['date', 'projects', 'hours'];

  form = this.fb.nonNullable.group({
    projectId: [0, Validators.required],
    workedHours: [0, Validators.required],
    workDate: ['', Validators.required],
    description: ['']
  });

  private load(): void {
    const userId = this.auth.user()?.id ?? 0;
    if (!userId) return;
    this.api.getProjectHoursByUserId(userId).subscribe(res => this.rows.set(res.data));
  }

  submit(): void {
    const userId = this.auth.user()?.id ?? 0;
    if (!userId || this.form.invalid) return;
    this.api.createProjectHours({ userId: userId, ...this.form.getRawValue( )})
      .subscribe(() => this.load());
  }

  ngOnInit(): void { this.load(); }
}
