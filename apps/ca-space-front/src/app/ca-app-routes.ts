import { Routes } from '@angular/router';

import { caLoginRoutes } from './ca-login/ca-login-routes';
import { CA_MAIN_ROUTES } from './ca-main/ca-main-routes';

export const CA_APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  ...caLoginRoutes,
  ...CA_MAIN_ROUTES,
];
