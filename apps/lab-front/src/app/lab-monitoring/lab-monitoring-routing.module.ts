import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  LabMonitoringPageComponent
} from './lab-monitoring-page/component/lab-monitoring-page/lab-monitoring-page.component';
import {
  LabMonitoringDashboardPageComponent
} from './lab-monitoring-page/component/lab-monitoring-dashboard-page/lab-monitoring-dashboard-page.component';
import {
  LabMonitoringVenvsPageComponent
} from './lab-monitoring-page/component/lab-monitoring-venvs-page/lab-monitoring-venvs-page.component';
import {
  LabMonitoringLogsPageComponent
} from './lab-monitoring-page/component/lab-monitoring-logs-page/lab-monitoring-logs-page.component';
import {
  LabMonitoringUsagePageComponent
} from './lab-monitoring-page/component/lab-monitoring-usage-page/lab-monitoring-usage-page.component';
import {
  LabMonitoringCredentialsPageComponent
} from './lab-monitoring-page/component/lab-monitoring-credentials-page/lab-monitoring-credentials-page.component';
import {
  LabMonitoringActivityPageComponent
} from './lab-monitoring-page/component/lab-monitoring-activity-page/lab-monitoring-activity-page.component';
import {
  LabMonitoringTagsPageComponent
} from './lab-monitoring-page/component/lab-monitoring-tags-page/lab-monitoring-tags-page.component';
import {
  LabMonitoringOtherPageComponent
} from './lab-monitoring-page/component/lab-monitoring-other-page/lab-monitoring-other-page.component';

const routes: Routes = [
  {
    path: '', component: LabMonitoringPageComponent, children: [
      {path: '', component: LabMonitoringDashboardPageComponent},
      {path: 'usage', component: LabMonitoringUsagePageComponent},
      {path: 'tags', component: LabMonitoringTagsPageComponent},
      {path: 'venvs', component: LabMonitoringVenvsPageComponent},
      {path: 'logs', component: LabMonitoringLogsPageComponent},
      {path: 'credentials', component: LabMonitoringCredentialsPageComponent},
      {path: 'activity', component: LabMonitoringActivityPageComponent},
      {path: 'other', component: LabMonitoringOtherPageComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabMonitoringRoutingModule {
}
