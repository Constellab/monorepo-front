import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  labConstBaseRoute,
  labConstBiotaRoute,
  labConstDataboxRoute,
  labConstDocRoute,
  labConstDocumentTemplateRoute,
  labConstExpeirmentRoute,
  labConstMonitoringRoute,
  labConstNoteRoute,
  labConstProtocolTemplateRoute,
  labConstViewboxRoute
} from '../lab-core/utils/lab-base-route';
import { LabMainAppComponent } from './component/lab-main-app/lab-main-app.component';
import { LabAutoLoginGuard } from './guard/lab-auto-login.guard';
import { FlLabRoute } from '@monorepo/front-core-lib';
import { LabLoadEnvironmentGuard } from './guard/lab-load-environment.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    // route to get the token from url and auto-log the user
    // the children : [] is used to make a route without a component because there is a redirection
    path: FlLabRoute.autoLogin.route, canActivate: [LabAutoLoginGuard], children: [],
  },
  {
    path: labConstBaseRoute, component: LabMainAppComponent, canActivate: [LabLoadEnvironmentGuard],
    children: [
      {
        path: '', redirectTo: labConstExpeirmentRoute, pathMatch: 'full'
      },

      ////////////////////////  BIOX  /////////////////////////
      {
        path: labConstExpeirmentRoute,
        loadChildren: () => import('../lab-biox/lab-biox.module').then(m => m.LabBioxModule)
      },

      ////////////////////////  PROTOCOL TEMPLATE  /////////////////////////
      {
        path: labConstProtocolTemplateRoute,
        loadChildren: () => import('../lab-protocol-template/lab-protocol-template.module').then(m => m.LabProtocolTemplateModule)
      },

      ////////////////////////  NOTE TEMPLATE  /////////////////////////
      {
        path: labConstDocumentTemplateRoute,
        loadChildren: () => import('../lab-document-template/lab-document-template.module').then(m => m.LabDocumentTemplateModule)
      },

      ////////////////////////  BIOTA  /////////////////////////
      {
        path: labConstBiotaRoute,
        loadChildren: () => import('../lab-biota/lab-biota.module').then(m => m.LabBiotaModule)
      },

      ////////////////////////  DATABOX  /////////////////////////
      {
        path: labConstDataboxRoute,
        loadChildren: () => import('../lab-databox/lab-databox.module').then(m => m.LabDataboxModule)
      },
      ////////////////////////  NOTE  /////////////////////////
      {
        path: labConstNoteRoute,
        loadChildren: () => import('../lab-note/lab-note.module').then(m => m.LabNoteModule)
      },
      ////////////////////////  VIEWBOX  /////////////////////////
      {
        path: labConstViewboxRoute,
        loadChildren: () => import('../lab-viewbox/lab-viewbox.module').then(m => m.LabViewboxModule)
      },
      ////////////////////////  DOC  /////////////////////////
      {
        path: labConstDocRoute,
        loadChildren: () => import('../lab-doc/lab-doc.module').then(m => m.LabDocModule)
      },
      //////////////////////// MONITORING  /////////////////////////
      {
        path: labConstMonitoringRoute,
        loadChildren: () => import('../lab-monitoring/lab-monitoring.module').then(m => m.LabMonitoringModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabMainRoutingModule {
}
