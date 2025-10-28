import { Routes } from '@angular/router';
import { projectHoursPresetResolver } from './hours.resolver';
import { projectHoursApiProvider } from '@app/infrastructure/api/hours/hours-api.provider';
import { provideHoursState } from './hours.state.providers';
import { USE_MOCK_PROJECT_HOURS_API } from '@app/infrastructure/api/hours/project-hours/project-hours.token';
import { provideHoursInit } from './hours.init';

export default [
  {
    path: '',
    title: 'Horas de Proyectos',
    providers: [
      projectHoursApiProvider(),
      provideHoursState(),
      { provide: USE_MOCK_PROJECT_HOURS_API, useValue: true },
      provideHoursInit(),
    ],
    loadComponent: () =>
      import('./ui/pages/project-hours-page/project-hours-page').then((m) => m.ProjectHoursPage),
    resolve: { preset: projectHoursPresetResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: 'projectHours/:projectId',
    title: 'Horas de Proyectos',
    providers: [
      projectHoursApiProvider(),
      provideHoursState(),
      { provide: USE_MOCK_PROJECT_HOURS_API, useValue: true },
      provideHoursInit(),
    ],
    loadComponent: () =>
      import('./ui/pages/project-hours-page/project-hours-page').then((m) => m.ProjectHoursPage),
    resolve: { preset: projectHoursPresetResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
] satisfies Routes;
