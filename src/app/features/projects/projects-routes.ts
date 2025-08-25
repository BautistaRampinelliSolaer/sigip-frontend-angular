export const PROJECTS_ROUTES = [
    {
        path: '',
        loadComponent: () => import('./list/projects-page/projects-page').then(m => m.ProjectsPage),
    },
    {
        path: 'create',
        loadComponent: () => import('./project-create/project-create').then(m => m.ProjectCreate)
    }
];