import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CaAdminDashboardPageComponent} from './component/ca-admin-dashboard-page/ca-admin-dashboard-page.component';
import {CaAdminPageComponent} from './component/ca-admin-page/ca-admin-page.component';
import {CaAdminOthersPageComponent} from './component/ca-admin-others-page/ca-admin-others-page.component';
import {CaAdminSpacesPageComponent} from './component/ca-admin-spaces-page/ca-admin-spaces-page.component';
import {CaAdminUsersPageComponent} from './component/ca-admin-users-page/ca-admin-users-page.component';
import {
  CaAdminLabInstancesPageComponent
} from './component/ca-admin-lab-instances-page/ca-admin-lab-instances-page.component';
import {CaAdminBucketsPageComponent} from './component/ca-admin-buckets-page/ca-admin-buckets-page.component';
import {
  CaAdminServerInfoPageComponent
} from './component/ca-admin-server-info-page/ca-admin-server-info-page.component';

const routes: Route[] = [
  {
    path: '', component: CaAdminPageComponent, children: [
      {path: '', component: CaAdminDashboardPageComponent},
      {path: 'spaces', component: CaAdminSpacesPageComponent},
      {path: 'users', component: CaAdminUsersPageComponent},
      {path: 'labs', component: CaAdminLabInstancesPageComponent},
      {path: 'servers', component: CaAdminOthersPageComponent},
      {path: 'buckets', component: CaAdminBucketsPageComponent},
      {path: 'servers-info', component: CaAdminServerInfoPageComponent},
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CaAdminRoutingModule {
}

