import { Routes } from '@angular/router';

import { CA_CONST_REDIRECT_ROUTE } from '../ca-core/utils/ca-base-route';

/**
 * Light routes (outside /app, no shell) to redirect to a resource/app.
 */
export const CA_RESOURCE_REDIRECT_ROUTES: Routes = [
  {
    path: `${CA_CONST_REDIRECT_ROUTE}/resource/:id`,
    loadComponent: () =>
      import('./ca-resource-redirect-page/ca-resource-redirect-page.component').then(
        (m) => m.CaResourceRedirectPageComponent
      ),
  },
];
