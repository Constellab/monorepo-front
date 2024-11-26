import { Routes } from '@angular/router';
import { LabOpenRouteResourcePageComponent } from './lab-open-route-resource-page/lab-open-route-resource-page.component';

export const LAB_OPEN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'resource/:token',
        component: LabOpenRouteResourcePageComponent,
      },
    ],
  },
];
