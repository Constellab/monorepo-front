import { Route } from '@angular/router';

import {
  caConstAdminRoute,
  caConstBaseRoute,
  caConstChatRoute,
  caConstFolderRoute,
  caConstHomeRoute,
  caConstLabsRoute,
  caConstPublicRoute,
  caConstStructureRoute,
  caConstUserPageRoute,
} from '../ca-core/utils/ca-base-route';
import { CaLoadUserGuard } from './guard/ca-load-user.guard';
import { CaAdminGuard } from '../ca-core/guard/ca-admin-guard.service';
import { caStructureRoutes } from '../ca-structure/ca-structure-routes';
import { caHierarchyObjectRoutes } from '../ca-folder/module/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page-routes';
import { caDashboardRoutes } from '../ca-dashboard/ca-dashboard-routes';
import { caLabRoutes } from '../ca-lab/ca-lab-routes';
import { caAdminRoutes } from '../ca-admin/ca-admin-routes';
import { caChatRoutes } from '../ca-chat/ca-chat-routes';
import { caUserRoutes } from '../ca-user-detail-page/ca-user-detail-page-routes';
import { CA_PUBLIC_ROUTES } from '../ca-public-route/ca-public-routes';

export const caMainRoutes: Route[] = [
  {
    path: '',
    redirectTo: caConstBaseRoute,
    pathMatch: 'full',
  },
  {
    path: caConstBaseRoute,
    loadComponent: () =>
      import('./component/ca-main-app/ca-main-app.component').then((m) => m.CaMainAppComponent),
    canActivate: [CaLoadUserGuard],
    children: [
      {
        path: '',
        redirectTo: caConstHomeRoute,
        pathMatch: 'full',
      },
      //////////////////////// DASHBOARD /////////////////////////
      {
        path: caConstHomeRoute,
        children: caDashboardRoutes,
      },

      //////////////////////// LAB /////////////////////////
      {
        path: caConstLabsRoute,
        children: caLabRoutes,
      },

      //////////////////////// FOLDER DETAIL /////////////////////////
      {
        path: caConstFolderRoute,
        children: caHierarchyObjectRoutes,
      },

      //////////////////////// Admin /////////////////////////
      {
        path: caConstAdminRoute,
        children: caAdminRoutes,
        canActivate: [CaAdminGuard],
      },
      //////////////////////// STRUCTURE /////////////////////////
      {
        path: caConstStructureRoute,
        children: caStructureRoutes,
      },
      //////////////////////// CHAT /////////////////////////
      {
        path: caConstChatRoute,
        children: caChatRoutes,
      },

      //////////////////////// USER PAGE /////////////////////////
      {
        path: caConstUserPageRoute,
        children: caUserRoutes,
      },
    ],
  },
  //////////////////////// OPEN  /////////////////////////
  {
    path: caConstPublicRoute,
    children: CA_PUBLIC_ROUTES,
  },
];
