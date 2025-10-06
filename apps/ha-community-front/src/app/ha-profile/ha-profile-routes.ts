import { Route } from '@angular/router';

export const haProfileRoutes: Route[] = [
  {
    path: '404',
    loadComponent: () => import('../ha404/ha404.component').then((m) => m.Ha404Component),
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
