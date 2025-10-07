import { Route } from '@angular/router';

export const haProfileRoutes: Route[] = [
  {
    path: '404',
    loadComponent: () =>
      import('../ha-404/ha-404-page/ha-404-page.component').then((m) => m.Ha404PageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./component/ha-profile/ha-profile.component').then((m) => m.HaProfileComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
