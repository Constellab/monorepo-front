import {Component} from '@angular/core';
import {LabRouterService} from '../../../../lab-core/service/lab-router.service';
import {FlHorizontalNavBarItem} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-monitoring-page',
  templateUrl: './lab-monitoring-page.component.html',
  styleUrls: ['./lab-monitoring-page.component.scss']
})
export class LabMonitoringPageComponent {

  routes: FlHorizontalNavBarItem[] = [
    {
      label: {text: 'monitoring.dashboard', translateText: true},
      icon: 'dashboard',
      route: LabRouterService.getMonitoringRoute(),
      linkActiveExact: true
    },
    {
      label: {text: 'monitoring.monitoring', translateText: true},
      icon: 'monitor_heart',
      route: LabRouterService.getMonitoringUsageRoute()
    },
    {
      label: {text: 'tags', translateText: true},
      icon: 'local_offer',
      route: LabRouterService.getMonitoringTagsRoute()
    },
    {
      label: {text: 'monitoring.venv_list', translateText: true},
      icon: 'takeout_dining',
      route: LabRouterService.getMonitoringVenvsRoute()
    },
    {
      label: {text: 'monitoring.bricks_data', translateText: true},
      icon: 'source',
      route: LabRouterService.getMonitoringBrickDataRoute()
    },
    {
      label: {text: 'monitoring.logs', translateText: true},
      icon: 'description',
      route: LabRouterService.getMonitoringLogsRoute()
    },
    {
      label: {text: 'biox.share_links', translateText: true},
      icon: 'share',
      route: LabRouterService.getMonitoringShareLinksRoute()
    },
    {
      label: {text: 'biox.credentials', translateText: true},
      icon: 'key',
      route: LabRouterService.getMonitoringCredentialsRoute()
    },
    {
      label: {text: 'monitoring.activities', translateText: true},
      icon: 'task',
      route: LabRouterService.getMonitoringActivityRoute()
    }
  ];

}
