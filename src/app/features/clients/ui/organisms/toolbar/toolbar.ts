import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-toolbar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  readonly query = input<string>('');
  readonly queryChanged = output<string>();
  readonly createRequested = output<void>();

  protected fc = new FormControl<string>('');

  ngOnInit() {
    this.fc.setValue(this.query());
  }
  onSubmit() {
    this.queryChanged.emit(this.fc.value ?? '');
  }
  onCreate() {
    this.createRequested.emit();
  }
}
