import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-contact-form',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './client-contact-form.html',
  styleUrls: ['./client-contact-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<ClientContactForm>);
  readonly data = inject(MAT_DIALOG_DATA, { optional: true }); // Could be private?

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    phone: [''],
    cellphone: [''],
    number_intern: [''],
    country: [''],
    city: [''],
  });

  ngOnInit() {
    if (this.data) this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue());
  }

  cancel() {
    this.ref.close();
  }
}
