import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sort, MatSortModule } from '@angular/material/sort';
import { ClientContactDTO } from '@app/domain/models';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-contact-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatSortModule],
  templateUrl: './client-contact-table.html',
  styleUrl: './client-contact-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'client-contact-table' },
})
export class ClientContactTable {
  readonly contacts = input<ClientContactDTO[]>([]);
  readonly sortChange = output<Sort>();
  readonly edit = output<ClientContactDTO>();
  readonly remove = output<void>();

  protected readonly displayed = ['name', 'email', 'phone', 'company', 'plant', 'actions'];

  onSortChange(sort: Sort) {
    this.sortChange.emit(sort);
  }
}
