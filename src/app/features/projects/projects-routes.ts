import { Routes } from '@angular/router';
import { pendingChangesGuard } from './ui/guard/pending-changes.guard';
import { USE_MOCK_PROJECTS_API } from '@app/infrastructure/api/projects/project/projects.token';
import { projectsApiProvider } from '@app/infrastructure/api/projects/projects-api.provider';
import { provideProjectsState } from './projects.state.providers';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      projectsApiProvider(),
      provideProjectsState(),
      { provide: USE_MOCK_PROJECTS_API, useValue: true },
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./ui/projects-page/projects-page').then((m) => m.ProjectsPage),
      },
      {
        path: ':id',
        canDeactivate: [pendingChangesGuard],
        loadComponent: () =>
          import('./ui/project-detail-page/project-detail-page').then((m) => m.ProjectDetailPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./ui/project-create/project-create').then((m) => m.ProjectCreate),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./ui/project-edit/project-edit').then((m) => m.ProjectEdit),
      },
    ],
  },
];
