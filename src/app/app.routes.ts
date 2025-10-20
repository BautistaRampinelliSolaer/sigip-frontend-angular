import { Routes } from '@angular/router';
import { authGuard, loginBlockGuard } from './core/auth/auth.guard';
import { features } from 'process';

export const routes: Routes = [
  {
    path: 'login',
    canMatch: [loginBlockGuard],
    loadComponent: () => import('@features/index').then((m) => m.LoginPage),
  },
  {
    path: '',
    canMatch: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('@features/index').then((m) => m.HomePage) },
      {
        path: 'clients',
        loadChildren: () => import('@features/clients/clients.routes').then((m) => m.default),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('@features/projects/projects-routes').then((m) => m.PROJECTS_ROUTES),
      },
      {
        path: 'hours',
        loadChildren: () => import('@features/hours/hours-routes').then((m) => m.default),
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/index').then((m) => m.ProfilePage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
