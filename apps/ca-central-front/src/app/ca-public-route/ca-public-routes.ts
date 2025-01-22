import { Routes } from '@angular/router';

export const CA_PUBLIC_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lab-price-simulator',
        loadComponent: () =>
          import('./ca-lab-price-simulator/ca-lab-price-simulator.component').then(
            (m) => m.CaLabPriceSimulatorComponent
          ),
      },
    ],
  },
];
