import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { LabMainAppComponent } from './component/lab-main-app/lab-main-app.component';
import { LabAutoLoginGuard } from './guard/lab-auto-login.guard';
import { FlLabRoute } from '@monorepo/front-core-lib';

const routes: Routes = [
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
    component: LabMainAppComponent,
    children: [
      {
        path: '',
        redirectTo: labConstScenarioRoute,
        pathMatch: 'full',
      },

      ////////////////////////  BIOX  /////////////////////////
      {
        path: labConstScenarioRoute,
        loadChildren: () => import('../lab-scenario/lab-scenario.module').then((m) => m.LabScenarioModule),
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: labConstScenarioTemplateRoute,
        loadChildren: () =>
          import('../lab-scenario-template/lab-scenario-template.module').then(
            (m) => m.LabScenarioTemplateModule
          ),
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: labConstNoteTemplateRoute,
        loadChildren: () =>
          import('../lab-note-template/lab-note-template.module').then((m) => m.LabNoteTemplateModule),
      },

      ////////////////////////  BIOTA  /////////////////////////
      {
        path: labConstBiotaRoute,
        loadChildren: () => import('../lab-biota/lab-biota.module').then((m) => m.LabBiotaModule),
      },

      ////////////////////////  DATA  ///////////////////////
      {
        path: labConstResourceRoute,
        loadChildren: () => import('../lab-resource/lab-resource.module').then((m) => m.LabResourceModule),
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: labConstNoteRoute,
        loadChildren: () => import('../lab-note/lab-note.module').then((m) => m.LabNoteModule),
      },
      ////////////////////////  VIEW  /////////////////////////
      {
        path: labConstViewRoute,
        loadChildren: () => import('../lab-view/lab-view.module').then((m) => m.LabViewModule),
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: labConstDocRoute,
        loadChildren: () =>
          import('../lab-documentation/lab-documentation.module').then((m) => m.LabDocumentationModule),
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: labConstMonitoringRoute,
        loadChildren: () =>
          import('../lab-monitoring/lab-monitoring.module').then((m) => m.LabMonitoringModule),
      },
    ],
  },

  //////////////////////// OPEN  /////////////////////////
  {
    path: labConstOpenRoute,
    loadChildren: () => import('../lab-open-route/lab-open.routes').then((m) => m.LAB_OPEN_ROUTES),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabMainRoutingModule {}
