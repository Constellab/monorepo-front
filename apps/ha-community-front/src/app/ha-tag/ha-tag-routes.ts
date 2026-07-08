import { Route } from '@angular/router';

export const HA_TAG_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module/ha-tag-list-page/ha-tag-list-page.component').then((m) => m.HaTagListPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./module/ha-tag-page/ha-tag-page.component').then((m) => m.HaTagPageComponent),
  },
  {
    path: ':id/:technicalName',
    loadComponent: () =>
      import('./module/ha-tag-page/ha-tag-page.component').then((m) => m.HaTagPageComponent),
  },
];
