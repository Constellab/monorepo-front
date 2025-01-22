import { Route } from '@angular/router';

export const caAdminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./component/ca-admin-page/ca-admin-page.component').then((m) => m.CaAdminPageComponent),
    children: [
      { path: '', redirectTo: 'spaces', pathMatch: 'full' },
      {
        path: 'spaces',
        loadComponent: () =>
          import('./component/ca-admin-spaces-page/ca-admin-spaces-page.component').then(
            (m) => m.CaAdminSpacesPageComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./component/ca-admin-users-page/ca-admin-users-page.component').then(
            (m) => m.CaAdminUsersPageComponent
          ),
      },
      {
        path: 'labs',
        loadComponent: () =>
          import('./component/ca-admin-labs-page/ca-admin-labs-page.component').then(
            (m) => m.CaAdminLabsPageComponent
          ),
      },
      {
        path: 'servers',
        loadComponent: () =>
          import('./component/ca-admin-others-page/ca-admin-others-page.component').then(
            (m) => m.CaAdminOthersPageComponent
          ),
      },
      {
        path: 'buckets',
        loadComponent: () =>
          import('./component/ca-admin-buckets-page/ca-admin-buckets-page.component').then(
            (m) => m.CaAdminBucketsPageComponent
          ),
      },
      {
        path: 'servers-info',
        loadComponent: () =>
          import('./component/ca-admin-server-page/ca-admin-server-page.component').then(
            (m) => m.CaAdminServerPageComponent
          ),
      },
      {
        path: 'mails',
        loadComponent: () =>
          import('./component/ca-admin-mails-page/ca-admin-mails-page.component').then(
            (m) => m.CaAdminMailsPageComponent
          ),
      },
    ],
  },
];
