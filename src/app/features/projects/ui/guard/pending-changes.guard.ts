import { CanDeactivateFn } from '@angular/router';

export interface PendingAware {
  hasPendingChanges: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<PendingAware> = (cmp) => {
  if (cmp?.hasPendingChanges?.()) {
    return confirm('Hay cambios sin guardar. ¿Salir de todos modos?');
  }
  return true;
};
