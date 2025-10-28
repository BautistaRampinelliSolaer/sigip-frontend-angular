import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { Sidenav, ThemeSwitcher, Header } from '@shared/ui';
import { ThemeService } from './core/theme/theme.service';
import { Footer } from './shared/ui/organisms/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    Sidenav,
    Footer,
    Header,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root' },
})
export class App {
  private readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);
  readonly router = inject(Router);

  readonly userName = computed(() => {
    const user = this.auth.user();
    return user ? `${user.name} ${user.lastname}`.trim() : 'Invitado';
  });

  readonly userRole = computed(() => {
    const user = this.auth.user();
    return user ? `${user.role}` : 'Invitado';
  });

  private readonly _sidenavOpen = signal(true);
  readonly isSidenavOpen = this._sidenavOpen.asReadonly();

  toggleSidenav(): void {
    this._sidenavOpen.update((v) => !v);
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
