import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {HaLiveTaskListComponent} from './components/ha-live-task-list/ha-live-task-list.component';
import {HaLiveTaskPageComponent} from './components/ha-live-task-page/ha-live-task-page.component';
import {
  HaLiveTaskVersionPageComponent
} from './components/ha-live-task-version-page/ha-live-task-version-page.component';
import {HaLiveTaskOverviewComponent} from './components/ha-live-task-overview/ha-live-task-overview.component';
import {HaLoginGuard} from '../ha-core/ha-guard/ha-login.guard';
import {HaLiveTaskInvitePageComponent} from './components/ha-live-task-invite-page/ha-live-task-invite-page.component';

const routes: Route[] = [
  {
    path: '',
    component: HaLiveTaskListComponent
  },
  {
    path: 'invite/:token',
    component: HaLiveTaskInvitePageComponent,
    canActivate: [HaLoginGuard]
  },
  {
    path: ':id/:title',
    component: HaLiveTaskPageComponent,
    children: [
      {
        path: '',
        component: HaLiveTaskOverviewComponent
      },
      {
        path: 'version/:versionNumber',
        component: HaLiveTaskVersionPageComponent
      }
    ]
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
export class HaLiveTaskRoutingModule {
}
