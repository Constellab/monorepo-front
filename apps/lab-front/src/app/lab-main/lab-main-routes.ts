import { Routes } from '@angular/router';
import {
  labConstBaseRoute,
  labConstBiotaRoute,
  labConstDocRoute,
  labConstMonitoringRoute,
  labConstNoteRoute,
  labConstNoteTemplateRoute,
  labConstOpenRoute,
  labConstResourceRoute,
  labConstScenarioRoute,
  labConstScenarioTemplateRoute,
  labConstViewRoute,
} from '../lab-core/utils/lab-base-route';

import { LabAutoLoginGuard } from './guard/lab-auto-login.guard';
import { FlLabRoute } from '@monorepo/front-core-lib';
import { labScenarioRoutes } from '../lab-scenario/lab-scenario-routes';
import { labScenarioTemplateRoutes } from '../lab-scenario-template/lab-scenario-template-routes';
import { labNoteTemplateRoutes } from '../lab-note-template/lab-note-template-routes';
import { labBiotaRoutes } from '../lab-biota/lab-biota-routes';
import { labResourceRoutes } from '../lab-resource/lab-resource-routes';
import { labNoteRoutes } from '../lab-note/lab-note-routes';
import { labViewRoutes } from '../lab-view/lab-view-routes';
import { labDocumentationRoutes } from '../lab-documentation/lab-documentation-routes';
import { labMonitoringRoutes } from '../lab-monitoring/lab-monitoring-routes';
import { LAB_OPEN_ROUTES } from '../lab-open-route/lab-open.routes';
import { LabLoginRoutes } from '../lab-login/lab-login-routes';

export const labMainRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    // route to get the token from url and auto-log the user
    // the children : [] is used to make a route without a component because there is a redirection
    path: FlLabRoute.autoLogin.route,
    canActivate: [LabAutoLoginGuard],
    children: [],
  },
  {
    path: labConstBaseRoute,
    loadComponent: () =>
      import('./component/lab-main-app/lab-main-app.component').then((m) => m.LabMainAppComponent),
    children: [
      {
        path: '',
        redirectTo: labConstScenarioRoute,
        pathMatch: 'full',
      },

      ////////////////////////  BIOX  /////////////////////////
      {
        path: labConstScenarioRoute,
        children: labScenarioRoutes,
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: labConstScenarioTemplateRoute,
        children: labScenarioTemplateRoutes,
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: labConstNoteTemplateRoute,
        children: labNoteTemplateRoutes,
      },

      ////////////////////////  BIOTA  /////////////////////////
      {
        path: labConstBiotaRoute,
        children: labBiotaRoutes,
      },

      ////////////////////////  RESOURCES  ///////////////////////
      {
        path: labConstResourceRoute,
        children: labResourceRoutes,
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: labConstNoteRoute,
        children: labNoteRoutes,
      },
      ////////////////////////  VIEW  /////////////////////////
      {
        path: labConstViewRoute,
        children: labViewRoutes,
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: labConstDocRoute,
        children: labDocumentationRoutes,
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: labConstMonitoringRoute,
        children: labMonitoringRoutes,
      },
    ],
  },

  //////////////////////// OPEN  /////////////////////////
  ...LabLoginRoutes,
  {
    path: labConstOpenRoute,
    children: LAB_OPEN_ROUTES,
  },
];
