import { LAB_OPEN_ROUTES } from '../lab-public-route/lab-public.routes';
import { LabAutoLoginGuard } from './guard/lab-auto-login.guard';
import { LabLoginRoutes } from '../lab-login/lab-login-routes';
import { Routes } from '@angular/router';
import { labBiotaRoutes } from '../lab-biota/lab-biota-routes';
import {
  liConstBaseRoute,
  liConstBiotaRoute,
  liConstDocRoute,
  liConstMonitoringRoute,
  liConstNoteRoute,
  liConstNoteTemplateRoute,
  liConstOpenRoute,
  liConstResourceRoute,
  liConstScenarioRoute,
  liConstScenarioTemplateRoute, liConstTagRoute,
  liConstViewRoute,
} from '@monorepo/lab-lib/li-core';
import { labDocumentationRoutes } from '../lab-documentation/lab-documentation-routes';
import { labMonitoringRoutes } from '../lab-monitoring/lab-monitoring-routes';
import { labNoteRoutes } from '../lab-note/lab-note-routes';
import { labNoteTemplateRoutes } from '../lab-note-template/lab-note-template-routes';
import { labResourceRoutes } from '../lab-resource/lab-resource-routes';
import { labScenarioRoutes } from '../lab-scenario/lab-scenario-routes';
import { labScenarioTemplateRoutes } from '../lab-scenario-template/lab-scenario-template-routes';
import { labViewRoutes } from '../lab-view/lab-view-routes';
import { labTagRoutes } from '../lab-tag/lab-tag-routes';

export const labMainRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    // route to get the token from url and auto-log the user
    // the children : [] is used to make a route without a component because there is a redirection
    path: 'auto-login',
    canActivate: [LabAutoLoginGuard],
    children: [],
  },
  {
    path: liConstBaseRoute,
    loadComponent: () =>
      import('./component/lab-main-app/lab-main-app.component').then((m) => m.LabMainAppComponent),
    children: [
      {
        path: '',
        redirectTo: liConstScenarioRoute,
        pathMatch: 'full',
      },

      ////////////////////////  BIOX  /////////////////////////
      {
        path: liConstScenarioRoute,
        children: labScenarioRoutes,
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: liConstScenarioTemplateRoute,
        children: labScenarioTemplateRoutes,
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: liConstNoteTemplateRoute,
        children: labNoteTemplateRoutes,
      },

      ////////////////////////  BIOTA  /////////////////////////
      {
        path: liConstBiotaRoute,
        children: labBiotaRoutes,
      },

      ////////////////////////  RESOURCES  ///////////////////////
      {
        path: liConstResourceRoute,
        children: labResourceRoutes,
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: liConstNoteRoute,
        children: labNoteRoutes,
      },
      ////////////////////////  VIEW  /////////////////////////
      {
        path: liConstViewRoute,
        children: labViewRoutes,
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: liConstDocRoute,
        children: labDocumentationRoutes,
      },
      //////////////////////// TAG ////////////////////////
      {
        path: liConstTagRoute,
        children: labTagRoutes,
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: liConstMonitoringRoute,
        children: labMonitoringRoutes,
      },
    ],
  },

  //////////////////////// OPEN  /////////////////////////
  ...LabLoginRoutes,
  {
    path: liConstOpenRoute,
    children: LAB_OPEN_ROUTES,
  },
];
