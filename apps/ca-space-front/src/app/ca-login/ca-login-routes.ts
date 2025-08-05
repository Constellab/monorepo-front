import { Routes } from '@angular/router';
import { FlResetPasswordPageComponent } from '@monorepo/front-core-lib/fl-auth';

import { CaLoginGuard } from './guard/ca-login.guard';

export const caLoginRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./component/ca-login-page/ca-login-page.component').then((m) => m.CaLoginPageComponent),
    canActivate: [CaLoginGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./component/ca-signup-page/ca-signup-page.component').then((m) => m.CaSignupPageComponent),
  },
  {
    path: 'signup-space/:code',
    loadComponent: () =>
      import('./component/ca-signup-to-space-page/ca-signup-to-space-page.component').then(
        (m) => m.CaSignupToSpacePageComponent
      ),
  },
  {
    path: 'reset-password/:token',
    component: FlResetPasswordPageComponent,
  },
  {
    path: 'no-space',
    loadComponent: () =>
      import('./component/ca-no-space-page/ca-no-space-page.component').then((m) => m.CaNoSpacePageComponent),
  },
];
