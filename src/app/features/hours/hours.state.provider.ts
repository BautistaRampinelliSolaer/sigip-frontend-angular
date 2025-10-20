import { Provider } from '@angular/core';
import { ProjectHoursState } from './data/state/project-hours.state';
import { ProjectHoursRepo } from './data/repos/project-hours.repo';
import { ProjectHoursUiStore } from './ui/stores/project-hours-ui.store';

export function provideHoursState(): Provider[] {
  return [ProjectHoursState, ProjectHoursRepo, ProjectHoursUiStore];
}
