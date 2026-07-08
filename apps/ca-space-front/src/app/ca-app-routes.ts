import { Routes } from '@angular/router';

import { caLoginRoutes } from './ca-login/ca-login-routes';
import { CA_MAIN_ROUTES } from './ca-main/ca-main-routes';
import { caResourceRedirectRoutes } from './ca-resource-redirect/ca-resource-redirect-routes';

export const CA_APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  ...caLoginRoutes,
  ...caResourceRedirectRoutes,
  ...CA_MAIN_ROUTES,
];
