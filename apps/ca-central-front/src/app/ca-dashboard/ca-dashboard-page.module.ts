import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CaDashboardPageComponent } from './component/ca-dashboard-page/ca-dashboard-page.component';
import { CaCoreModule } from '../ca-core/ca-core.module';
import { RouterModule } from '@angular/router';
import { CaLabCoreModule } from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { CaDashboardFoldersComponent } from './component/ca-dashboard-folders/ca-dashboard-folders.component';
import { CaDashboardLabsComponent } from './component/ca-dashboard-labs/ca-dashboard-labs.component';
import { CaDashboardTeamsComponent } from './component/ca-dashboard-teams/ca-dashboard-teams.component';
import { CaGroupCoreModule } from '../ca-core/entity-module/ca-group-core/ca-group-core.module';
import {
  CaDashboardMyActivityComponent,
} from './component/ca-dashboard-my-activity/ca-dashboard-my-activity.component';
import {
  CaDashboardTaskOfTheDayComponent,
} from './component/ca-dashboard-task-of-the-day/ca-dashboard-task-of-the-day.component';
import {
  CaDashboardActivityCardComponent,
} from './component/ca-dashboard-activity-card/ca-dashboard-activity-card.component';
import {
  CaDashboardListLayoutComponent,
} from './component/ca-dashboard-list-layout/ca-dashboard-list-layout.component';
import { CaDashboardRoutingModule } from './ca-dashboard-routing.module';
import { CaUserCoreModule } from '../ca-core/entity-module/ca-user-core/ca-user-core.module';
import {
  CaHierarchyObjectCoreModule,
} from '../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';
import { CaDashboardVideosComponent } from './component/ca-dashboard-videos/ca-dashboard-videos.component';

/**
 * Module for the dashboard page
 */
@NgModule({
  declarations: [
    CaDashboardPageComponent,
    CaDashboardFoldersComponent,
    CaDashboardLabsComponent,
    CaDashboardTeamsComponent,
    CaDashboardMyActivityComponent,
    CaDashboardTaskOfTheDayComponent,
    CaDashboardActivityCardComponent,
    CaDashboardListLayoutComponent,
    CaDashboardVideosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaHierarchyObjectCoreModule,
    CaLabCoreModule,
    CaGroupCoreModule,
    CaUserCoreModule,

    CaDashboardRoutingModule,
    NgOptimizedImage,
  ],
})
export class CaDashboardPageModule {}
