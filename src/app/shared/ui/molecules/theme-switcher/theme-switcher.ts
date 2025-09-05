import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@app/core/theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  imports: [],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcher {
  private svc = inject(ThemeService);

  protected theme = this.svc.theme;
  protected density = this.svc.density;

  protected setTheme(v: 'light'|'dark') { this.svc.setTheme(v); }
  protected setDensity(v: 'comfortable'|'compact') { this.svc.setDensity(v); }
}
