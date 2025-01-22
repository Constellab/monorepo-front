import { Route } from '@angular/router';

export const caDashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./component/ca-dashboard-page/ca-dashboard-page.component').then(
        (m) => m.CaDashboardPageComponent
      ),
  },
];
