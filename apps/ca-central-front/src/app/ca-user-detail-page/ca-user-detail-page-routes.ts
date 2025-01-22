import { Routes } from '@angular/router';

export const caUserRoutes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./component/ca-user-detail-page/ca-user-detail-page.component').then(
        (m) => m.CaUserDetailPageComponent
      ),
  },
];
