import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableSearch } from '../../atoms/table-search/table-search';
import { ColumnsToggle } from '../../atoms/columns-toggle/columns-toggle';

@Component({
  selector: 'app-table-toolbar',
  imports: [TableSearch, ColumnsToggle],
  templateUrl: './table-toolbar.html',
  styleUrl: './table-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbar {
  query = input<string>('');
  columns = input.required<{ id: string; header: string }[]>();
  hidden = input.required<Set<string>>();
  search = output<string>();
  toggle = output<string>();
}
