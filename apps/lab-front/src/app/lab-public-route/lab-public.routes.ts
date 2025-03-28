import { Routes } from '@angular/router';

export const LAB_OPEN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'resource/:token',
        loadComponent: () =>
          import('./lab-public-route-resource-page/lab-public-route-resource-page.component').then(
            (m) => m.LabPublicRouteResourcePageComponent
          ),
      },
    ],
  },
];
