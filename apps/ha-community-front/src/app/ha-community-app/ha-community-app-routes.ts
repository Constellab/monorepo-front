import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';

export const haCommunityAppRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/ha-community-app-list-page/ha-community-app-list-page.component').then(
        (m) => m.HaCommunityAppListPageComponent
      ),
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import('./components/ha-community-app-invite-page/ha-community-app-invite-page.component').then(
        (m) => m.HaCommunityAppInvitePageComponent
      ),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/ha-community-app-page/ha-community-app-page.component').then(
        (m) => m.HaCommunityAppPageComponent
      ),
  },
  {
    path: ':id/:title',
    loadComponent: () =>
      import('./components/ha-community-app-page/ha-community-app-page.component').then(
        (m) => m.HaCommunityAppPageComponent
      ),
  },
];
