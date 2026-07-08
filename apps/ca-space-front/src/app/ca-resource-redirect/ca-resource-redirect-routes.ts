import { Routes } from '@angular/router';

import { caConstRedirectRoute } from '../ca-core/utils/ca-base-route';

/**
 * Light routes (outside /app, no shell) to redirect to a resource/app.
 */
export const caResourceRedirectRoutes: Routes = [
  {
    path: `${caConstRedirectRoute}/resource/:id`,
    loadComponent: () =>
      import('./ca-resource-redirect-page/ca-resource-redirect-page.component').then(
        (m) => m.CaResourceRedirectPageComponent
      ),
  },
];
