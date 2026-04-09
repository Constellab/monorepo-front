import { Routes } from '@angular/router';

import { haAdminRoutes } from '../ha-admin/ha-admin-routes';
import { haAgentRoutes } from '../ha-agent/ha-agent-routes';
import { haBrickRoutes } from '../ha-brick/ha-brick-routes';
import { haCommunityAppRoutes } from '../ha-community-app/ha-community-app-routes';
import { haPartnerRoutes } from '../ha-partner/ha-partner-routes';
import { haProfileRoutes } from '../ha-profile/ha-profile-routes';
import { haStoryRoutes } from '../ha-story/ha-story-routes';
import { haTagRoutes } from '../ha-tag/ha-tag-routes';

/**
 * Main application routes.
 *
 * Each feature module (bricks, stories, agents, etc.) has its own route file (e.g. ha-brick-routes.ts)
 * loaded as children of HaMainComponent, which provides the shared layout (header, footer, sidenav).
 *
 * Exceptions:
 * - /login and /cli-auth are standalone pages WITHOUT the shared layout.
 * - /icons is inlined here (no dedicated route file) since it's a single page.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const haMainRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haAdminRoutes,
  },
  {
    path: 'bricks',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haBrickRoutes,
  },
  {
    path: 'stories',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haStoryRoutes,
  },
  {
    path: 'live-tasks',
    redirectTo: 'agents',
  },
  {
    path: 'agents',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haAgentRoutes,
  },
  {
    path: 'partners',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haPartnerRoutes,
  },
  {
    path: 'profile',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haProfileRoutes,
  },
  {
    path: 'apps',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haCommunityAppRoutes,
  },
  {
    path: 'icons',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../ha-icon/component/ha-icons-page/ha-icons-page.component').then(
            (m) => m.HaIconsPageComponent
          ),
      },
    ],
  },
  {
    path: 'tags',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haTagRoutes,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./ha-login-page/ha-login-page.component').then((m) => m.HaLoginPageComponent),
  },
  {
    path: 'cli-auth',
    loadComponent: () =>
      import('../ha-cli-auth/ha-cli-auth-page/ha-cli-auth-page.component').then(
        (m) => m.HaCliAuthPageComponent
      ),
  },
  {
    path: '',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../ha-home/ha-home/ha-home.component').then((m) => m.HaHomeComponent),
      },
      {
        path: '404',
        loadComponent: () =>
          import('../ha-404/ha-404-page/ha-404-page.component').then((m) => m.Ha404PageComponent),
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
