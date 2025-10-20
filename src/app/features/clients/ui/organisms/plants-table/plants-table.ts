import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PlantCompanyDTO } from '@app/domain/models';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

@Component({
  selector: 'plants-table',
  templateUrl: './plants-table.html',
  styleUrls: ['./plants-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sigip-table' },
  imports: [MatTable, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef],
})
export class PlantsTableComponent {
  readonly items = input.required<PlantCompanyDTO[]>();
  readonly rowClick = output<number>();
  protected displayed = ['name', 'company', 'city', 'email'];

  protected open(id: number) {
    this.rowClick.emit(id);
  }
}
