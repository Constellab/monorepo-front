import { Routes } from '@angular/router';

export const LAB_OPEN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'resource/:token',
        loadComponent: () =>
          import('./lab-open-route-resource-page/lab-open-route-resource-page.component').then(
            (m) => m.LabOpenRouteResourcePageComponent
          ),
      },
    ],
  },
];
