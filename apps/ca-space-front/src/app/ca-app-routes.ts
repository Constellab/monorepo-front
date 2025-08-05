import { Routes } from '@angular/router';

import { caLoginRoutes } from './ca-login/ca-login-routes';
import { caMainRoutes } from './ca-main/ca-main-routes';

export const caAppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  ...caLoginRoutes,
  ...caMainRoutes,
];
