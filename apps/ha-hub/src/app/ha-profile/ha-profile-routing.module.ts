import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {HaProfileComponent} from './component/ha-profile/ha-profile.component';

const routes: Route[] = [
  {
    path: ':id',
    component: HaProfileComponent,
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HaProfileRoutingModule {
}
