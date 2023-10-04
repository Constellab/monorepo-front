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

const routes: Route[] = [
  {path: '', component: CaMyLabInstancesPageComponent},
  {
    path: ':id', component: CaLabInstanceDetailPageComponent, children: [
      {path: '', component: CaLabInstanceDashboardPageComponent},
      {path: 'config', component: CaLabInstanceConfigPageComponent},
      {path: 'usage', component: CaLabInstanceUsagePageComponent},
      {path: 'backup', component: CaLabBackupDetailPageComponent},
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

