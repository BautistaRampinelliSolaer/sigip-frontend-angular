import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { LOGIN_NAV_DELAY_MS } from './login-delay.token';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loginNavDelayMs = inject(LOGIN_NAV_DELAY_MS);
  
  loading = signal(false);
  error = signal<string | null>(null);
  hidePassword = signal(true);

  form = this.fb.group<LoginForm>({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  submit(): void {
    if (this.loading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.form.getRawValue());
    
    setTimeout(() => { 
      this.loading.set(false); 
      this.router.navigateByUrl('/');
    }, this.loginNavDelayMs);
  }
  
}
