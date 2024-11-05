import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaUserDetailPageComponent } from './component/ca-user-detail-page/ca-user-detail-page.component';

const loginRoutes: Routes = [{ path: ':id', component: CaUserDetailPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule],
})
export class CaUserDetailPageRoutingModule {}
