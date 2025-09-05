import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-cell',
  imports: [],
  template: `{{ value() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCell {
  value = input<unknown>(null)
}
