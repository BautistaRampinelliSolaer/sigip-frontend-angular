import { inject } from '@angular/core';
import { ProjectHoursApi } from './project-hours.api';
import { USE_MOCK_PROJECT_HOURS_API } from './project-hours.token';
import { ProjectHoursHttpApi } from './project-hours.http.api';
import { ProjectHoursMockApi } from './project-hours.api.mock';

export const PROJECT_HOURS_API_PROVIDER = {
  provide: ProjectHoursApi,
  useFactory: () =>
    inject(USE_MOCK_PROJECT_HOURS_API) ? inject(ProjectHoursMockApi) : inject(ProjectHoursHttpApi),
};
