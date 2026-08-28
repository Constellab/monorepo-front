import { Routes } from '@angular/router';

import { HA_ADMIN_ROUTES } from '../ha-admin/ha-admin-routes';
import { HA_AGENT_ROUTES } from '../ha-agent/ha-agent-routes';
import { HA_AI_INTEGRATION_ROUTES } from '../ha-ai-integration/ha-ai-integration-routes';
import { HA_BRICK_ROUTES } from '../ha-brick/ha-brick-routes';
import { HA_COMMUNITY_APP_ROUTES } from '../ha-community-app/ha-community-app-routes';
import { HA_PARTNER_ROUTES } from '../ha-partner/ha-partner-routes';
import { HA_PROFILE_ROUTES } from '../ha-profile/ha-profile-routes';
import { HA_STORY_ROUTES } from '../ha-story/ha-story-routes';
import { HA_TAG_ROUTES } from '../ha-tag/ha-tag-routes';

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
    children: HA_ADMIN_ROUTES,
  },
  {
    path: 'bricks',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_BRICK_ROUTES,
  },
  {
    path: 'stories',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_STORY_ROUTES,
  },
  {
    path: 'live-tasks',
    redirectTo: 'agents',
  },
  {
    path: 'agents',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_AGENT_ROUTES,
  },
  {
    path: 'partners',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_PARTNER_ROUTES,
  },
  {
    path: 'profile',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_PROFILE_ROUTES,
  },
  {
    path: 'apps',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_COMMUNITY_APP_ROUTES,
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
    children: HA_TAG_ROUTES,
  },
  {
    path: 'ai-integration',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: HA_AI_INTEGRATION_ROUTES,
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
