import { Routes } from '@angular/router';

export const labViewRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-view-search-page/lab-view-search-page/lab-view-search-page.component').then(
        (m) => m.LabViewSearchPageComponent
      ),
  },
];
