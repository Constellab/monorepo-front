import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaAdminPageComponent } from './component/ca-admin-page/ca-admin-page.component';
import { CaAdminOthersPageComponent } from './component/ca-admin-others-page/ca-admin-others-page.component';
import { CaAdminSpacesPageComponent } from './component/ca-admin-spaces-page/ca-admin-spaces-page.component';
import { CaAdminUsersPageComponent } from './component/ca-admin-users-page/ca-admin-users-page.component';
import { CaAdminLabsPageComponent } from './component/ca-admin-labs-page/ca-admin-labs-page.component';
import { CaAdminBucketsPageComponent } from './component/ca-admin-buckets-page/ca-admin-buckets-page.component';
import { CaAdminServerPageComponent } from './component/ca-admin-server-page/ca-admin-server-page.component';

const routes: Route[] = [
  {
    path: '',
    component: CaAdminPageComponent,
    children: [
      { path: '', redirectTo: 'spaces', pathMatch: 'full' },
      { path: 'spaces', component: CaAdminSpacesPageComponent },
      { path: 'users', component: CaAdminUsersPageComponent },
      { path: 'labs', component: CaAdminLabsPageComponent },
      { path: 'servers', component: CaAdminOthersPageComponent },
      { path: 'buckets', component: CaAdminBucketsPageComponent },
      { path: 'servers-info', component: CaAdminServerPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaAdminRoutingModule {}
