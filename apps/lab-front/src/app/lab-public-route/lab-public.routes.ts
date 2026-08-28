import { Routes } from '@angular/router';

export const LAB_OPEN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'resource/:token',
        loadComponent: () =>
          import('./lab-public-route-resource-page/lab-public-route-resource-page.component').then(
            (m) => m.LabPublicRouteResourcePageComponent
          ),
      },
      {
        // Front-owned app-link gateway: the stable, bookmarkable entrypoint + progress screen.
        // Optionally carries ?code=<one-time> for space/external opens.
        path: 'app/:appKey',
        loadComponent: () =>
          import('./lab-open-app-page/lab-open-app-page.component').then(
            (m) => m.LabOpenAppPageComponent
          ),
      },
      {
        // Keyless variant: the nginx fallback resolver redirects here with ?error=<reason> when a
        // shared app URL maps to no app. There is no key to open, so the page only renders the
        // error — reusing the gateway's styled, translated failure UI instead of letting the
        // browser display the API's raw JSON error envelope.
        path: 'app',
        loadComponent: () =>
          import('./lab-open-app-page/lab-open-app-page.component').then(
            (m) => m.LabOpenAppPageComponent
          ),
      },
    ],
  },
];
