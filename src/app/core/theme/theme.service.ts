import { Injectable, effect, signal, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UniversalStorage } from '../storage/universal.storage';

type ThemeName = 'light' | 'dark';
type DensityName = 'comfortable' | 'compact';

const THEME_KEY = 'app-theme';
const DENSITY_KEY = 'app-density';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storage = inject(UniversalStorage);
  private overlay = inject(OverlayContainer);

  readonly theme = signal<ThemeName>(this.storage.get<ThemeName>(THEME_KEY) ?? 'light');
  readonly density = signal<DensityName>(this.storage.get<DensityName>(DENSITY_KEY) ?? 'comfortable');

  constructor() {
    // Reaccionar a cambios y aplicar clases
    effect(() => {
      const t = this.theme();
      const d = this.density();

      this.storage.set(THEME_KEY, t);
      this.storage.set(DENSITY_KEY, d);

      const html = typeof document !== 'undefined' ? document.documentElement : null;
      const classes = ['app-theme--light', 'app-theme--dark', 'density--comfortable', 'density--compact'];
      const add = [`app-theme--${t}`, `density--${d}`];

      // <html>
      if (html) {
        html.classList.remove(...classes);
        html.classList.add(...add);
      }

      // Overlays (Dialog, Menu, Tooltip)
      const overlayEl = this.overlay.getContainerElement();
      overlayEl.classList.remove(...classes);
      overlayEl.classList.add(...add);
    });
  }

  setTheme(theme: ThemeName) { this.theme.set(theme); }
  toggleTheme() { this.theme.set(this.theme() === 'light' ? 'dark' : 'light'); }

  setDensity(density: DensityName) { this.density.set(density); }
  toggleDensity() { this.density.set(this.density() === 'comfortable' ? 'compact' : 'comfortable'); }
}
