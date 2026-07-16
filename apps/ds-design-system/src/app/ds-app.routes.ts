import { Route } from '@angular/router';

export const dsAppRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./page/ds-material-override-page/ds-material-override-page.component').then(
        (m) => m.DsMaterialOverridePageComponent
      ),
  },
];
