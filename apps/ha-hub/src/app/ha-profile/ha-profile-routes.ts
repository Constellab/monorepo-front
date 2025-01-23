import { Route } from '@angular/router';

export const haProfileRoutes: Route[] = [
  {
    path: ':id',
    loadComponent: () =>
      import('./component/ha-profile/ha-profile.component').then((m) => m.HaProfileComponent),
  },
];
