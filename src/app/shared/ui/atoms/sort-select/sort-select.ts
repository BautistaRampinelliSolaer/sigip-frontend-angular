import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

export type SortKey = 'name' | 'industry' | 'city' | 'company';
export type SortDir = 'asc' | 'desc';

@Component({
  selector: 'sort-select',
  templateUrl: './sort-select.html',
  styleUrl: './sort-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sort-select' },
  imports: [MatIconModule],
})
export class SortSelect {
  readonly sortBy = input<SortKey>('name');
  readonly sortDir = input<SortDir>('asc');
  readonly sortByChange = output<SortKey>();
  readonly sortDirChange = output<SortDir>();

  protected onKeyChange(v: string) {
    this.sortByChange.emit(v as SortKey);
  }

  protected toggleDir() {
    this.sortDirChange.emit(this.sortDir() === 'asc' ? 'desc' : 'asc');
  }
}
