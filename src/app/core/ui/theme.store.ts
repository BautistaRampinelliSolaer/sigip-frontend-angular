import {
  computed,
  DOCUMENT,
  effect,
  inject,
  Injectable,
  signal,
  Injector,
  afterNextRender,
  runInInjectionContext,
} from '@angular/core';
import { BrowserStorage } from '../storage/storage';

export type Theme = 'theme-light' | 'theme-dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  private storage = inject(BrowserStorage);
  private doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private readonly _current = signal<Theme>('theme-light');
  readonly current = computed(() => this._current());

  private syncHtmlClass(t: Theme) {
    const html = this.doc.documentElement;
    html.classList.remove('theme-light', 'theme-dark');
    html.classList.add(t);
  }

  constructor() {
    afterNextRender(() => {
      const saved = (this.storage.getItem('theme') as Theme | null) ?? 'theme-light';
      this._current.set(saved);
      this.syncHtmlClass(saved);
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const t = this._current();
        this.syncHtmlClass(t);
        this.storage.setItem('theme', t);
      });
    });
  }

  set(t: Theme) {
    this._current.set(t);
  }
  toggle() {
    this._current.update((t) => (t === 'theme-light' ? 'theme-dark' : 'theme-light'));
  }
}
