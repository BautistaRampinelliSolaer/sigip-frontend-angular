import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-columns-toggle',
  imports: [MatIcon, MatMenuModule, MatCheckboxModule],
  templateUrl: './columns-toggle.html',
  styleUrl: './columns-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsToggle {
  columns = input.required<{ id: string; header: string }[]>();
  hidden = input.required<Set<string>>();
  toggle = output<string>();
}
