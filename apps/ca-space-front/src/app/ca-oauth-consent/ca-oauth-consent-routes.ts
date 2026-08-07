import { Routes } from '@angular/router';

import { CA_CONST_OAUTH_CONSENT_ROUTE } from '../ca-core/utils/ca-base-route';

/**
 * The consent step of the OAuth flow, outside the app shell and deliberately behind no guard: the
 * page owns its own login bounce, and a guard would send a visitor without a session to a login page
 * that has lost the consent id - abandoning a flow with a client waiting on the other end.
 */
export const CA_OAUTH_CONSENT_ROUTES: Routes = [
  {
    path: CA_CONST_OAUTH_CONSENT_ROUTE,
    loadComponent: () =>
      import('./component/ca-oauth-consent-page/ca-oauth-consent-page.component').then(
        (m) => m.CaOauthConsentPageComponent
      ),
  },
];
