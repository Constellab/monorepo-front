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

import { LAB_APP_ROUTES } from '../lab-app/lab-app-routes';
import { LAB_BIOTA_ROUTES } from '../lab-biota/lab-biota-routes';
import { LAB_DOCUMENTATION_ROUTES } from '../lab-documentation/lab-documentation-routes';
import { LAB_FORM_ROUTES } from '../lab-form/lab-form-routes';
import { LAB_FORM_TEMPLATE_ROUTES } from '../lab-form-template/lab-form-template-routes';
import { LAB_LOGIN_ROUTES } from '../lab-login/lab-login-routes';
import { LAB_MONITORING_ROUTES } from '../lab-monitoring/lab-monitoring-routes';
import { LAB_NOTE_ROUTES } from '../lab-note/lab-note-routes';
import { LAB_NOTE_TEMPLATE_ROUTES } from '../lab-note-template/lab-note-template-routes';
import { LAB_OPEN_ROUTES } from '../lab-public-route/lab-public.routes';
import { LAB_RESOURCE_ROUTES } from '../lab-resource/lab-resource-routes';
import { LAB_SCENARIO_ROUTES } from '../lab-scenario/lab-scenario-routes';
import { LAB_SCENARIO_TEMPLATE_ROUTES } from '../lab-scenario-template/lab-scenario-template-routes';
import { LAB_TAG_ROUTES } from '../lab-tag/lab-tag-routes';
import { LAB_VIEW_ROUTES } from '../lab-view/lab-view-routes';
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
        children: LAB_SCENARIO_ROUTES,
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: LI_CONST_SCENARIO_TEMPLATE_ROUTE,
        children: LAB_SCENARIO_TEMPLATE_ROUTES,
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: LI_CONST_NOTE_TEMPLATE_ROUTE,
        children: LAB_NOTE_TEMPLATE_ROUTES,
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
        children: LAB_BIOTA_ROUTES,
      },

      ////////////////////////  RESOURCES  ///////////////////////
      {
        path: LI_CONST_RESOURCE_ROUTE,
        children: LAB_RESOURCE_ROUTES,
      },
      ////////////////////////  APP  /////////////////////////
      {
        path: LI_CONST_APP_ROUTE,
        children: LAB_APP_ROUTES,
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: LI_CONST_NOTE_ROUTE,
        children: LAB_NOTE_ROUTES,
      },
      ////////////////////////  VIEW  /////////////////////////
      {
        path: LI_CONST_VIEW_ROUTE,
        children: LAB_VIEW_ROUTES,
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: LI_CONST_DOC_ROUTE,
        children: LAB_DOCUMENTATION_ROUTES,
      },
      //////////////////////// TAG ////////////////////////
      {
        path: LI_CONST_TAG_ROUTE,
        children: LAB_TAG_ROUTES,
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: LI_CONST_MONITORING_ROUTE,
        children: LAB_MONITORING_ROUTES,
      },
    ],
  },

  //////////////////////// OPEN  /////////////////////////
  ...LAB_LOGIN_ROUTES,
  {
    path: LI_CONST_OPEN_ROUTE,
    children: LAB_OPEN_ROUTES,
  },
];
