import { inject, provideEnvironmentInitializer } from '@angular/core';
import { ProjectHoursRepo } from './data/repos/project-hours.repo';

export function provideHoursInit() {
  return provideEnvironmentInitializer(() => {
    const projectHours = inject(ProjectHoursRepo);

    projectHours.getAll();
  });
}
