import { Routes } from '@angular/router';

export const LAB_MONITORING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-monitoring-page/component/lab-monitoring-page/lab-monitoring-page.component').then(
        (m) => m.LabMonitoringPageComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            './lab-monitoring-page/component/lab-monitoring-dashboard-page/lab-monitoring-dashboard-page.component'
          ).then((m) => m.LabMonitoringDashboardPageComponent),
      },
      {
        path: 'usage',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-usage-page/lab-monitoring-usage-page.component').then(
            (m) => m.LabMonitoringUsagePageComponent
          ),
      },
      {
        path: 'virtual-envs',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-venvs-page/lab-monitoring-venvs-page.component').then(
            (m) => m.LabMonitoringVenvsPageComponent
          ),
      },
      {
        path: 'logs',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-logs-page/lab-monitoring-logs-page.component').then(
            (m) => m.LabMonitoringLogsPageComponent
          ),
      },
      {
        path: 'lab',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-lab-page/lab-monitoring-lab-page.component').then(
            (m) => m.LabMonitoringLabPageComponent
          ),
      },
      {
        path: 'credentials',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            './lab-monitoring-page/component/lab-monitoring-credentials-page/lab-monitoring-credentials-page.component'
          ).then((m) => m.LabMonitoringCredentialsPageComponent),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            './lab-monitoring-page/component/lab-monitoring-activity-page/lab-monitoring-activity-page.component'
          ).then((m) => m.LabMonitoringActivityPageComponent),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-jobs-page/lab-monitoring-jobs-page.component').then(
            (m) => m.LabMonitoringJobsPageComponent
          ),
      },
      {
        path: 'other',
        loadComponent: () =>
          // eslint-disable-next-line max-len
          import('./lab-monitoring-page/component/lab-monitoring-other-page/lab-monitoring-other-page.component').then(
            (m) => m.LabMonitoringOtherPageComponent
          ),
      },
    ],
  },
];
