import { Routes } from '@angular/router';
import {
  LI_CONST_APP_ROUTE,
  LI_CONST_BASE_ROUTE,
  LI_CONST_BIOTA_ROUTE,
  LI_CONST_DOC_ROUTE,
  LI_CONST_FORM_ROUTE,
  LI_CONST_FORM_TEMPLATE_ROUTE,
  LI_CONST_MONITORING_ROUTE,
  LI_CONST_NOTE_ROUTE,
  LI_CONST_NOTE_TEMPLATE_ROUTE,
  LI_CONST_OPEN_ROUTE,
  LI_CONST_RESOURCE_ROUTE,
  LI_CONST_SCENARIO_ROUTE,
  LI_CONST_SCENARIO_TEMPLATE_ROUTE,
  LI_CONST_TAG_ROUTE,
  LI_CONST_VIEW_ROUTE,
} from '@monorepo/lab-lib/li-core';

import { labAppRoutes } from '../lab-app/lab-app-routes';
import { labBiotaRoutes } from '../lab-biota/lab-biota-routes';
import { labDocumentationRoutes } from '../lab-documentation/lab-documentation-routes';
import { LAB_FORM_ROUTES } from '../lab-form/lab-form-routes';
import { LAB_FORM_TEMPLATE_ROUTES } from '../lab-form-template/lab-form-template-routes';
import { LabLoginRoutes } from '../lab-login/lab-login-routes';
import { LAB_MONITORING_ROUTES } from '../lab-monitoring/lab-monitoring-routes';
import { labNoteRoutes } from '../lab-note/lab-note-routes';
import { labNoteTemplateRoutes } from '../lab-note-template/lab-note-template-routes';
import { LAB_OPEN_ROUTES } from '../lab-public-route/lab-public.routes';
import { labResourceRoutes } from '../lab-resource/lab-resource-routes';
import { labScenarioRoutes } from '../lab-scenario/lab-scenario-routes';
import { labScenarioTemplateRoutes } from '../lab-scenario-template/lab-scenario-template-routes';
import { labTagRoutes } from '../lab-tag/lab-tag-routes';
import { labViewRoutes } from '../lab-view/lab-view-routes';
import { LabAutoLoginGuard } from './guard/lab-auto-login.guard';

export const LAB_MAIN_ROUTES: Routes = [
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
    path: LI_CONST_BASE_ROUTE,
    loadComponent: () =>
      import('./component/lab-main-app/lab-main-app.component').then((m) => m.LabMainAppComponent),
    children: [
      {
        path: '',
        redirectTo: LI_CONST_SCENARIO_ROUTE,
        pathMatch: 'full',
      },

      ////////////////////////  BIOX  /////////////////////////
      {
        path: LI_CONST_SCENARIO_ROUTE,
        children: labScenarioRoutes,
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: LI_CONST_SCENARIO_TEMPLATE_ROUTE,
        children: labScenarioTemplateRoutes,
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: LI_CONST_NOTE_TEMPLATE_ROUTE,
        children: labNoteTemplateRoutes,
      },

      ////////////////////////  FORM TEMPLATE  /////////////////////////
      {
        path: LI_CONST_FORM_TEMPLATE_ROUTE,
        children: LAB_FORM_TEMPLATE_ROUTES,
      },

      ////////////////////////  FORM  /////////////////////////
      {
        path: LI_CONST_FORM_ROUTE,
        children: LAB_FORM_ROUTES,
      },

      ////////////////////////  BIOTA  /////////////////////////
      {
        path: LI_CONST_BIOTA_ROUTE,
        children: labBiotaRoutes,
      },

      ////////////////////////  RESOURCES  ///////////////////////
      {
        path: LI_CONST_RESOURCE_ROUTE,
        children: labResourceRoutes,
      },
      ////////////////////////  APP  /////////////////////////
      {
        path: LI_CONST_APP_ROUTE,
        children: labAppRoutes,
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: LI_CONST_NOTE_ROUTE,
        children: labNoteRoutes,
      },
      ////////////////////////  VIEW  /////////////////////////
      {
        path: LI_CONST_VIEW_ROUTE,
        children: labViewRoutes,
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: LI_CONST_DOC_ROUTE,
        children: labDocumentationRoutes,
      },
      //////////////////////// TAG ////////////////////////
      {
        path: LI_CONST_TAG_ROUTE,
        children: labTagRoutes,
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: LI_CONST_MONITORING_ROUTE,
        children: LAB_MONITORING_ROUTES,
      },
    ],
  },

  //////////////////////// OPEN  /////////////////////////
  ...LabLoginRoutes,
  {
    path: LI_CONST_OPEN_ROUTE,
    children: LAB_OPEN_ROUTES,
  },
];
