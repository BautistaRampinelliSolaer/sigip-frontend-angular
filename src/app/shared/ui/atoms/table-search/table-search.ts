import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-table-search',
  imports: [MatInputModule, MatFormFieldModule],
  templateUrl: './table-search.html',
  styleUrl: './table-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearch {
  query = input<string>('');
  changed = output<string>();
}
