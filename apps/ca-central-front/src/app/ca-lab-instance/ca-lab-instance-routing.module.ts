import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  CaLabInstanceDetailPageComponent
} from './component/ca-lab-instance-detail-page/ca-lab-instance-detail-page.component';
import {CaMyLabInstancesPageComponent} from './component/ca-my-lab-instances-page/ca-my-lab-instances-page.component';
import {
  CaLabInstanceDashboardPageComponent
} from './component/ca-lab-instance-dashboard-page/ca-lab-instance-dashboard-page.component';
import {
  CaLabInstanceConfigPageComponent
} from './component/ca-lab-instance-config-page/ca-lab-instance-config-page.component';
import {
  CaLabInstanceUsagePageComponent
} from './component/kpi/ca-lab-instance-usage-page/ca-lab-instance-usage-page.component';
import {
  CaLabBackupDetailPageComponent
} from './component/backup/ca-lab-backup-detail-page/ca-lab-backup-detail-page.component';
import {CaLabCreatePageComponent} from './component/create/ca-lab-create-page/ca-lab-create-page.component';
import {
  CaLabInstanceStatusHistoryPageComponent
} from './component/ca-lab-instance-status-history-page/ca-lab-instance-status-history-page.component';
import {CaLabSupportPageComponent} from './component/support/ca-lab-support-page/ca-lab-support-page.component';

const routes: Route[] = [
  {path: '', component: CaMyLabInstancesPageComponent},
  {path: 'create', component: CaLabCreatePageComponent},
  {
    path: ':id', component: CaLabInstanceDetailPageComponent, children: [
      {path: '', component: CaLabInstanceDashboardPageComponent},
      {path: 'config', component: CaLabInstanceConfigPageComponent},
      {path: 'usage', component: CaLabInstanceUsagePageComponent},
      {path: 'backup', component: CaLabBackupDetailPageComponent},
      {path: 'status-history', component: CaLabInstanceStatusHistoryPageComponent},
      {path: 'support', component: CaLabSupportPageComponent},
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
export class CaLabInstanceRoutingModule {
}

