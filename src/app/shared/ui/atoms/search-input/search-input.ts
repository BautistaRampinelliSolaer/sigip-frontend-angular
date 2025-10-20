import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'search-input',
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'search-input',
    '[style.--_radius]': "'var(--radius-md)'",
  },
  imports: [MatIconModule],
})
export class SearchInput {
  readonly placeholder = input<string>('Buscar...');
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  protected readonly buffer = signal(this.value());

  constructor() {
    effect(() => this.buffer.set(this.value()));
  }

  protected onInput(v: string) {
    this.buffer.set(v);
    this.valueChange.emit(v);
  }

  protected clear() {
    this.buffer.set('');
    this.valueChange.emit('');
  }
}
