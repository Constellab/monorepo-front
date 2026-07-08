import { Route } from '@angular/router';

export const CA_LAB_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./component/lab/ca-my-labs-page/ca-my-labs-page.component').then(
        (m) => m.CaMyLabsPageComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./component/create/ca-lab-create-page/ca-lab-create-page.component').then(
        (m) => m.CaLabCreatePageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./component/lab/ca-lab-detail-page/ca-lab-detail-page.component').then(
        (m) => m.CaLabDetailPageComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./component/lab/ca-lab-dashboard-page/ca-lab-dashboard-page.component').then(
            (m) => m.CaLabDashboardPageComponent
          ),
      },
      {
        path: 'config',
        loadComponent: () =>
          import('./component/lab/ca-lab-config-page/ca-lab-config-page.component').then(
            (m) => m.CaLabConfigPageComponent
          ),
      },
      {
        path: 'usage',
        loadComponent: () =>
          import('./component/kpi/ca-lab-usage-page/ca-lab-usage-page.component').then(
            (m) => m.CaLabUsagePageComponent
          ),
      },
      {
        path: 'backup',
        loadComponent: () =>
          import('./component/backup/ca-lab-backup-detail-page/ca-lab-backup-detail-page.component').then(
            (m) => m.CaLabBackupDetailPageComponent
          ),
      },
      {
        path: 'status-history',
        loadComponent: () =>
          import('./component/lab/ca-lab-status-history-page/ca-lab-status-history-page.component').then(
            (m) => m.CaLabStatusHistoryPageComponent
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./component/support/ca-lab-support-page/ca-lab-support-page.component').then(
            (m) => m.CaLabSupportPageComponent
          ),
      },
    ],
  },
];
