import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Company } from '@app/domain/models';
import {
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

@Component({
  selector: 'companies-table',
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'table' },
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
  ],
})
export class CompaniesTable {
  readonly items = input.required<Company[]>();
  readonly rowClick = output<number>();

  protected displayed = ['name', 'commercialName', 'industry', 'group'];
  protected open(id: number) {
    this.rowClick.emit(id);
  }
}
