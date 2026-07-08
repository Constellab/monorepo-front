import { Route } from '@angular/router';

import { CA_ADMIN_ROUTES } from '../ca-admin/ca-admin-routes';
import { CA_CHAT_ROUTES } from '../ca-chat/ca-chat-routes';
import { CaAdminGuard } from '../ca-core/guard/ca-admin-guard.service';
import {
  CA_CONST_ADMIN_ROUTE,
  CA_CONST_BASE_ROUTE,
  CA_CONST_CHAT_ROUTE,
  CA_CONST_FOLDER_ROUTE,
  CA_CONST_HOME_ROUTE,
  CA_CONST_LABS_ROUTE,
  CA_CONST_PUBLIC_ROUTE,
  CA_CONST_STRUCTURE_ROUTE,
  CA_CONST_USER_PAGE_ROUTE,
} from '../ca-core/utils/ca-base-route';
import { CA_DASHBOARD_ROUTES } from '../ca-dashboard/ca-dashboard-routes';
import { CA_HIERARCHY_OBJECT_ROUTES } from '../ca-folder/module/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page-routes';
import { CA_LAB_ROUTES } from '../ca-lab/ca-lab-routes';
import { CA_PUBLIC_ROUTES } from '../ca-public-route/ca-public-routes';
import { CA_STRUCTURE_ROUTES } from '../ca-structure/ca-structure-routes';
import { CA_USER_ROUTES } from '../ca-user-detail-page/ca-user-detail-page-routes';
import { CaLoadUserGuard } from './guard/ca-load-user.guard';

export const CA_MAIN_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: CA_CONST_BASE_ROUTE,
    pathMatch: 'full',
  },
  {
    path: CA_CONST_BASE_ROUTE,
    loadComponent: () =>
      import('./component/ca-main-app/ca-main-app.component').then((m) => m.CaMainAppComponent),
    canActivate: [CaLoadUserGuard],
    children: [
      {
        path: '',
        redirectTo: CA_CONST_HOME_ROUTE,
        pathMatch: 'full',
      },
      //////////////////////// DASHBOARD /////////////////////////
      {
        path: CA_CONST_HOME_ROUTE,
        children: CA_DASHBOARD_ROUTES,
      },

      //////////////////////// LAB /////////////////////////
      {
        path: CA_CONST_LABS_ROUTE,
        children: CA_LAB_ROUTES,
      },

      //////////////////////// FOLDER DETAIL /////////////////////////
      {
        path: CA_CONST_FOLDER_ROUTE,
        children: CA_HIERARCHY_OBJECT_ROUTES,
      },

      //////////////////////// Admin /////////////////////////
      {
        path: CA_CONST_ADMIN_ROUTE,
        children: CA_ADMIN_ROUTES,
        canActivate: [CaAdminGuard],
      },
      //////////////////////// STRUCTURE /////////////////////////
      {
        path: CA_CONST_STRUCTURE_ROUTE,
        children: CA_STRUCTURE_ROUTES,
      },
      //////////////////////// CHAT /////////////////////////
      {
        path: CA_CONST_CHAT_ROUTE,
        children: CA_CHAT_ROUTES,
      },

      //////////////////////// USER PAGE /////////////////////////
      {
        path: CA_CONST_USER_PAGE_ROUTE,
        children: CA_USER_ROUTES,
      },
    ],
  },
  //////////////////////// OPEN  /////////////////////////
  {
    path: CA_CONST_PUBLIC_ROUTE,
    children: CA_PUBLIC_ROUTES,
  },
];
