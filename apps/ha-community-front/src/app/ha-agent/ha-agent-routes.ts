import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';

export const haAgentRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/ha-agent-list/ha-agent-list.component').then((m) => m.HaAgentListComponent),
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import('./components/ha-agent-invite-page/ha-agent-invite-page.component').then(
        (m) => m.HaAgentInvitePageComponent
      ),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/ha-agent-page/ha-agent-page.component').then((m) => m.HaAgentPageComponent),
  },
  {
    path: ':id/:title',
    loadComponent: () =>
      import('./components/ha-agent-page/ha-agent-page.component').then((m) => m.HaAgentPageComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/ha-agent-overview/ha-agent-overview.component').then(
            (m) => m.HaAgentOverviewComponent
          ),
      },
      {
        path: 'version/:versionNumber',
        loadComponent: () =>
          import('./components/ha-agent-version-page/ha-agent-version-page.component').then(
            (m) => m.HaAgentVersionPageComponent
          ),
      },
    ],
  },
];
