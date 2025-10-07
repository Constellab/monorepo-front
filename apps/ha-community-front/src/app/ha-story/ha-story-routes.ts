import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import { HaStoryGuard } from '../ha-core/ha-guard/ha-story.guard';

export const haStoryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module/ha-story-list-page/ha-story-list-page.component').then(
        (m) => m.HaStoryListPageComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./module/ha-story-edit-page/ha-story-edit-page.component').then(
        (m) => m.HaStoryEditPageComponent
      ),
    canActivate: [HaStoryGuard],
  },
  {
    path: '404',
    loadComponent: () =>
      import('../ha-404/ha-404-page/ha-404-page.component').then((m) => m.Ha404PageComponent),
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import('../ha-invite/ha-invite-page/ha-invite-page.component').then((m) => m.HaInvitePageComponent),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./module/ha-story-page/ha-story-page.component').then((m) => m.HaStoryPageComponent),
  },
  {
    path: ':id/:title',
    loadComponent: () =>
      import('./module/ha-story-page/ha-story-page.component').then((m) => m.HaStoryPageComponent),
  },
];
