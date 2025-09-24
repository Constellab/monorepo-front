import { Routes } from '@angular/router';

export const labAppRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-app-search-page/lab-app-search-page.component').then((m) => m.LabAppSearchPageComponent),
  },
];
