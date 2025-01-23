import { Route } from '@angular/router';
import { HaAdminGuard } from '../ha-core/ha-guard/ha-admin.guard';

export const haAdminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module/ha-admin-page/ha-admin-page.component').then((m) => m.HaAdminPageComponent),
    canActivate: [HaAdminGuard],
  },
];
