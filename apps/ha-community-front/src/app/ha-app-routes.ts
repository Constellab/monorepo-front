import { Routes } from '@angular/router';

import { haMainRoutes } from './ha-main/ha-main-routes';

export const haAppRoutes: Routes = [
  {
    path: '',
    children: haMainRoutes,
  },
];
