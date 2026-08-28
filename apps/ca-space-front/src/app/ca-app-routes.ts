import { Routes } from '@angular/router';

import { CA_LOGIN_ROUTES } from './ca-login/ca-login-routes';
import { CA_MAIN_ROUTES } from './ca-main/ca-main-routes';
import { CA_OAUTH_CONSENT_ROUTES } from './ca-oauth-consent/ca-oauth-consent-routes';
import { CA_RESOURCE_REDIRECT_ROUTES } from './ca-resource-redirect/ca-resource-redirect-routes';

export const CA_APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  ...CA_LOGIN_ROUTES,
  ...CA_OAUTH_CONSENT_ROUTES,
  ...CA_RESOURCE_REDIRECT_ROUTES,
  ...CA_MAIN_ROUTES,
];
