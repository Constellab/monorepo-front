import { Routes } from '@angular/router';

import { LabLoginGuard } from './guard/lab-login.guard';

export const LabLoginRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./component/lab-login-page/lab-login-page.component').then((m) => m.LabLoginPageComponent),
    canActivate: [LabLoginGuard],
  },
];
