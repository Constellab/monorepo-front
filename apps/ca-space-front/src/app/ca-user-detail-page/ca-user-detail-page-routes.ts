import { Routes } from '@angular/router';

export const CA_USER_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./component/ca-user-detail-page/ca-user-detail-page.component').then(
        (m) => m.CaUserDetailPageComponent
      ),
  },
];
