import { Route } from '@angular/router';

export const haCommunityAppRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/ha-community-app-list-page/ha-community-app-list-page.component').then(
        (m) => m.HaCommunityAppListPageComponent
      ),
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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/ha-community-app-detail/ha-community-app-detail.component').then(
            (m) => m.HaCommunityAppDetailComponent
          ),
      },
      {
        path: 'app',
        loadComponent: () =>
          import('./components/ha-community-app/ha-community-app.component').then(
            (m) => m.HaCommunityAppComponent
          ),
      },
    ],
  },
];
