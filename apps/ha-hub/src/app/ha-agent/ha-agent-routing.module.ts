import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HaAgentListComponent } from './components/ha-agent-list/ha-agent-list.component';
import { HaAgentPageComponent } from './components/ha-agent-page/ha-agent-page.component';
import { HaAgentVersionPageComponent } from './components/ha-agent-version-page/ha-agent-version-page.component';
import { HaAgentOverviewComponent } from './components/ha-agent-overview/ha-agent-overview.component';
import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import { HaAgentInvitePageComponent } from './components/ha-agent-invite-page/ha-agent-invite-page.component';

const routes: Route[] = [
  {
    path: '',
    component: HaAgentListComponent,
  },
  {
    path: 'invite/:token',
    component: HaAgentInvitePageComponent,
    canActivate: [HaLoginGuard],
  },
  {
    path: ':id',
    component: HaAgentPageComponent,
  },
  {
    path: ':id/:title',
    component: HaAgentPageComponent,
    children: [
      {
        path: '',
        component: HaAgentOverviewComponent,
      },
      {
        path: 'version/:versionNumber',
        component: HaAgentVersionPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HaAgentRoutingModule {}
