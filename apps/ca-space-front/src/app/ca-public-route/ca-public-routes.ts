import { Routes } from '@angular/router';

export const CA_PUBLIC_ROUTES: Routes = [
  {
    path: 'lab-price-simulator',
    loadComponent: () =>
      import('./ca-lab-price-simulator/ca-lab-price-simulator.component').then(
        (m) => m.CaLabPriceSimulatorComponent
      ),
  },
  {
    path: 'object/:token',
    loadComponent: () =>
      import('./ca-public-hierarchy-object-page/ca-public-hierarchy-object-page.component').then(
        (m) => m.CaPublicHierarchyObjectPageComponent
      ),
  },
];
