import { Routes } from '@angular/router';

import { LabLoginGuard } from './guard/lab-login.guard';

export const LAB_LOGIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./component/lab-login-page/lab-login-page.component').then((m) => m.LabLoginPageComponent),
    canActivate: [LabLoginGuard],
  },
];
