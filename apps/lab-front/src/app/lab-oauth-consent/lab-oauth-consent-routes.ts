import { Routes } from '@angular/router';

/**
 * OAuth consent route. Deliberately top-level and NOT behind the authenticated app shell:
 * the page owns its own login bounce (unauthenticated → /login?redirect_uri=/oauth-consent?login_state=…),
 * so wrapping it in an auth guard would discard login_state. See {@link LabOAuthConsentPageComponent}.
 */
export const LAB_OAUTH_CONSENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-oauth-consent-page/lab-oauth-consent-page.component').then(
        (m) => m.LabOAuthConsentPageComponent
      ),
  },
];
