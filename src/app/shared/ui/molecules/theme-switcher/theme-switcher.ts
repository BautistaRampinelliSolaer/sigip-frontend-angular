import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeStore } from '@app/core/ui/theme.store';

@Component({
  selector: 'app-theme-switcher',
  imports: [],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcher {
  private readonly theme = inject(ThemeStore);
  protected readonly isDark = computed(() => this.theme.current() === 'theme-dark');

  setLight() {
    this.theme.set('theme-light');
  }
  setDark() {
    this.theme.set('theme-dark');
  }
  toggle() {
    this.theme.toggle();
  }
}
