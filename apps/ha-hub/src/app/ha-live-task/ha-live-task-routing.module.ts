import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {HaLiveTaskListComponent} from './components/ha-live-task-list/ha-live-task-list.component';
import {HaLiveTaskPageComponent} from './components/ha-live-task-page/ha-live-task-page.component';
import {
  HaLiveTaskVersionPageComponent
} from './components/ha-live-task-version-page/ha-live-task-version-page.component';
import {HaLiveTaskOverviewComponent} from './components/ha-live-task-overview/ha-live-task-overview.component';
import {HaLiveTaskCommentsComponent} from './components/ha-live-task-comments/ha-live-task-comments.component';
import {HaLiveTaskVersionsComponent} from './components/ha-live-task-versions/ha-live-task-versions.component';

const routes: Route[] = [
  {
    path: '',
    component: HaLiveTaskListComponent
  },
  {
    path: ':id',
    redirectTo: ':id/'
  },
  {
    path: ':id/versions/:versionId',
    component: HaLiveTaskVersionPageComponent,
  },
  {
    path: ':id',
    component: HaLiveTaskPageComponent,
    children: [
      {
        path: '',
        component: HaLiveTaskOverviewComponent
      },
      {
        path: 'comments',
        component: HaLiveTaskCommentsComponent
      },
      {
        path: 'versions',
        component: HaLiveTaskVersionsComponent
      }
    ]
  },
  // {
  //   path: 'edit/:id',
  //   component: HaStoryEditPageComponent,
  //   canActivate: [HaStoryGuard]
  // },
  // {
  //   path: ':id',
  //   component: HaStoryPageComponent
  // },
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
