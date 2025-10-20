import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  open = input(false);
  title = input('¿Confirmar acción?');
  message = input('Esta acción no se puede deshacer.');
  confirmText = input('Confirmar');
  cancelText = input('Cancelar');

  confirm = output<void>();
  cancel = output<void>();
}
