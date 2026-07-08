import { Routes } from '@angular/router';

import { haMainRoutes } from './ha-main/ha-main-routes';

export const HA_APP_ROUTES: Routes = [
  {
    path: '',
    children: haMainRoutes,
  },
];
