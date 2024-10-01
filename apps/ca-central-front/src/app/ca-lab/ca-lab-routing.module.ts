import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  CaLabDetailPageComponent
} from './component/lab/ca-lab-detail-page/ca-lab-detail-page.component';
import {CaMyLabsPageComponent} from './component/lab/ca-my-labs-page/ca-my-labs-page.component';
import {
  CaLabDashboardPageComponent
} from './component/lab/ca-lab-dashboard-page/ca-lab-dashboard-page.component';
import {
  CaLabConfigPageComponent
} from './component/lab/ca-lab-config-page/ca-lab-config-page.component';
import {
  CaLabUsagePageComponent
} from './component/kpi/ca-lab-usage-page/ca-lab-usage-page.component';
import {
  CaLabBackupDetailPageComponent
} from './component/backup/ca-lab-backup-detail-page/ca-lab-backup-detail-page.component';
import {CaLabCreatePageComponent} from './component/create/ca-lab-create-page/ca-lab-create-page.component';
import {
  CaLabStatusHistoryPageComponent
} from './component/lab/ca-lab-status-history-page/ca-lab-status-history-page.component';
import {CaLabSupportPageComponent} from './component/support/ca-lab-support-page/ca-lab-support-page.component';

const routes: Route[] = [
  {path: '', component: CaMyLabsPageComponent},
  {path: 'create', component: CaLabCreatePageComponent},
  {
    path: ':id', component: CaLabDetailPageComponent, children: [
      {path: '', component: CaLabDashboardPageComponent},
      {path: 'config', component: CaLabConfigPageComponent},
      {path: 'usage', component: CaLabUsagePageComponent},
      {path: 'backup', component: CaLabBackupDetailPageComponent},
      {path: 'status-history', component: CaLabStatusHistoryPageComponent},
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
export class CaLabRoutingModule {
}

