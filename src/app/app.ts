import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { Sidenav, ThemeSwitcher } from '@shared/ui';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule, 
    MatSidenavModule, 
    MatListModule, 
    NgOptimizedImage, 
    Sidenav,
    ThemeSwitcher
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root'}
})
export class App {
  protected title = 'SIGIP';

  private readonly _theme = inject(ThemeService)

  readonly auth = inject(AuthService);
  readonly router = inject(Router);

  readonly userName = computed(() => {
    const user = this.auth.user();
    return user ? `${user.name} ${user.lastname}`.trim() : 'Invitado';
  })

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
