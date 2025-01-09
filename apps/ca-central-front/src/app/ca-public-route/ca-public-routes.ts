import { Routes } from '@angular/router';
import { CaLabPriceSimulatorComponent } from './ca-lab-price-simulator/ca-lab-price-simulator.component';

export const CA_PUBLIC_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lab-price-simulator',
        component: CaLabPriceSimulatorComponent,
      },
    ],
  },
];
