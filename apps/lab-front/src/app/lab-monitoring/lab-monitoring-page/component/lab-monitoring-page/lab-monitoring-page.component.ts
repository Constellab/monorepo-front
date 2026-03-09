import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiRouterService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-page',
  templateUrl: './lab-monitoring-page.component.html',
  styleUrls: ['./lab-monitoring-page.component.scss'],
  imports: [FlHorizontalNavBarModule, FlTextIconModule, MatIcon, RouterOutlet, TranslatePipe],
})
export class LabMonitoringPageComponent {
  routes: FlHorizontalNavBarItem[] = [
    {
      label: { text: 'monitoring.dashboard', translateText: true },
      icon: 'dashboard',
      route: LiRouterService.getMonitoringRoute(),
      linkActiveExact: true,
    },
    {
      label: { text: 'monitoring.monitoring', translateText: true },
      icon: 'monitor_heart',
      route: LiRouterService.getMonitoringUsageRoute(),
    },
    {
      label: { text: 'monitoring.venv_list', translateText: true },
      icon: 'takeout_dining',
      route: LiRouterService.getMonitoringVenvsRoute(),
    },
    {
      label: { text: 'monitoring.logs', translateText: true },
      icon: 'description',
      route: LiRouterService.getMonitoringLogsRoute(),
    },
    {
      label: { text: 'biox.credentials', translateText: true },
      icon: 'key',
      route: LiRouterService.getMonitoringCredentialsRoute(),
    },
    {
      label: { text: 'monitoring.activities', translateText: true },
      icon: 'task',
      route: LiRouterService.getMonitoringActivityRoute(),
    },
    {
      label: { text: 'monitoring.jobs', translateText: true },
      icon: 'work',
      route: LiRouterService.getMonitoringJobsRoute(),
    },
    {
      label: { text: 'monitoring.other', translateText: true },
      icon: 'source',
      route: LiRouterService.getOtherRoute(),
    },
  ];
}
