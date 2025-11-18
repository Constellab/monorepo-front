import { Route } from '@angular/router';

export const haPartnerRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module/ha-partner-list-page/ha-partner-list-page.component').then(
        (m) => m.HaPartnerListPageComponent
      ),
  },
  {
    path: ':partnerId/:partnerName',
    loadComponent: () =>
      import('./module/ha-partner-page/ha-partner-page.component').then((m) => m.HaPartnerPageComponent),
  },
  {
    path: ':partnerId',
    loadComponent: () =>
      import('./module/ha-partner-page/ha-partner-page.component').then((m) => m.HaPartnerPageComponent),
  },
];
