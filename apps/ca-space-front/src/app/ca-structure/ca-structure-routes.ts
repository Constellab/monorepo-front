import { Route } from '@angular/router';

export const caStructureRoutes: Route[] = [
  {
    path: 'current-space',
    loadComponent: () =>
      import('./ca-space-page/component/ca-current-space-page/ca-current-space-page.component').then(
        (m) => m.CaCurrentSpacePageComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            './ca-space-page/component/ca-current-space-dashboard-page/ca-current-space-dashboard-page.component'
          ).then((m) => m.CaCurrentSpaceDashboardPageComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import(
            './ca-space-page/component/ca-current-space-users-page/ca-current-space-users-page.component'
          ).then((m) => m.CaCurrentSpaceUsersPageComponent),
      },
      {
        path: 'labs',
        loadComponent: () =>
          import(
            './ca-space-page/component/ca-current-space-labs-page/ca-current-space-labs-page.component'
          ).then((m) => m.CaCurrentSpaceLabsPageComponent),
      },
      {
        path: 'folders',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            './ca-space-page/component/ca-current-space-hierarchy-object-page/ca-current-space-hierarchy-object-page.component'
          ).then((m) => m.CaCurrentSpaceHierarchyObjectPageComponent),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import(
            './ca-space-page/component/ca-current-space-teams-page/ca-current-space-teams-page.component'
          ).then((m) => m.CaCurrentSpaceTeamsPageComponent),
      },
      {
        path: 'other',
        loadComponent: () =>
          import(
            './ca-space-page/component/ca-current-space-other-page/ca-current-space-other-page.component'
          ).then((m) => m.CaCurrentSpaceOtherPageComponent),
      },
    ],
  },
  {
    path: 'team/:id',
    loadComponent: () =>
      import('./ca-team-page/component/ca-team-page/ca-team-page.component').then(
        (m) => m.CaTeamPageComponent
      ),
  },
  {
    path: 'my-teams',
    loadComponent: () =>
      import('./ca-my-groups-page/component/ca-my-teams-page/ca-my-teams-page.component').then(
        (m) => m.CaMyTeamsPageComponent
      ),
  },
];
