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
    loadComponent: () => import('../ha-public/module/ha404/ha404.component').then((m) => m.Ha404Component),
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import('./module/ha-story-invite-page/ha-story-invite-page.component').then(
        (m) => m.HaStoryInvitePageComponent
      ),
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
