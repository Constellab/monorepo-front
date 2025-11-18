import { Route } from '@angular/router';

import { HaAdminGuard } from '../ha-core/ha-guard/ha-admin.guard';

export const haAdminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module/ha-admin-panel-page/ha-admin-panel-page.component').then(
        (m) => m.HaAdminPanelPageComponent
      ),
    canActivate: [HaAdminGuard],
    children: [
      { path: '', redirectTo: 'bricks', pathMatch: 'full' },
      {
        path: 'bricks',
        loadComponent: () =>
          import('./module/ha-admin-panel-bricks/ha-admin-panel-bricks.component').then(
            (m) => m.HaAdminPanelBricksComponent
          ),
      },
      {
        path: 'stories',
        loadComponent: () =>
          import('./module/ha-admin-panel-stories/ha-admin-panel-stories.component').then(
            (m) => m.HaAdminPanelStoriesComponent
          ),
      },
      {
        path: 'partners',
        loadComponent: () =>
          import('./module/ha-admin-panel-partners/ha-admin-panel-partners.component').then(
            (m) => m.HaAdminPanelPartnersComponent
          ),
      },
    ],
  },
];
