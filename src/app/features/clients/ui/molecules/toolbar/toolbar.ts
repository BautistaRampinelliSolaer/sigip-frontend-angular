import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SortDir, SortKey, SearchInput, SortSelect } from '@app/shared/ui';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'clients-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'clients-toolbar' },
  imports: [SearchInput, SortSelect, MatButton, MatIconModule],
})
export class ClientsToolbar {
  readonly search = input<string>('');
  readonly sortBy = input<SortKey>('name');
  readonly sortDir = input<SortDir>('asc');

  readonly searchChange = output<string>();
  readonly sortByChange = output<SortKey>();
  readonly sortDirChange = output<SortDir>();
}
