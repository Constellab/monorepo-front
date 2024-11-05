import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaCurrentSpacePageComponent } from './ca-space-page/component/ca-current-space-page/ca-current-space-page.component';
import { CaMyTeamsPageComponent } from './ca-my-groups-page/component/ca-my-teams-page/ca-my-teams-page.component';
import { CaTeamPageComponent } from './ca-team-page/component/ca-team-page/ca-team-page.component';
import { CaCurrentSpaceDashboardPageComponent } from './ca-space-page/component/ca-current-space-dashboard-page/ca-current-space-dashboard-page.component';
import { CaCurrentSpaceUsersPageComponent } from './ca-space-page/component/ca-current-space-users-page/ca-current-space-users-page.component';
import { CaCurrentSpaceLabsPageComponent } from './ca-space-page/component/ca-current-space-labs-page/ca-current-space-labs-page.component';
import { CaCurrentSpaceFoldersPageComponent } from './ca-space-page/component/ca-current-space-folders-page/ca-current-space-folders-page.component';
import { CaCurrentSpaceTeamsPageComponent } from './ca-space-page/component/ca-current-space-teams-page/ca-current-space-teams-page.component';
import { CaCurrentSpaceOtherPageComponent } from './ca-space-page/component/ca-current-space-other-page/ca-current-space-other-page.component';

const routes: Route[] = [
  {
    path: 'current-space',
    component: CaCurrentSpacePageComponent,
    children: [
      { path: '', component: CaCurrentSpaceDashboardPageComponent },
      { path: 'users', component: CaCurrentSpaceUsersPageComponent },
      { path: 'labs', component: CaCurrentSpaceLabsPageComponent },
      { path: 'folders', component: CaCurrentSpaceFoldersPageComponent },
      { path: 'teams', component: CaCurrentSpaceTeamsPageComponent },
      { path: 'other', component: CaCurrentSpaceOtherPageComponent },
    ],
  },
  { path: 'team/:id', component: CaTeamPageComponent },
  { path: 'my-teams', component: CaMyTeamsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaStructureRoutingModule {}
