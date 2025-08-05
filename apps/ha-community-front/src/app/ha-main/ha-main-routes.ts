import { Routes } from '@angular/router';

import { haAdminRoutes } from '../ha-admin/ha-admin-routes';
import { haAgentRoutes } from '../ha-agent/ha-agent-routes';
import { haCommunityAppRoutes } from '../ha-community-app/ha-community-app-routes';
import { haProfileRoutes } from '../ha-profile/ha-profile-routes';
import { haPublicRoutes } from '../ha-public/ha-public-routes';
import { haStoryRoutes } from '../ha-story/ha-story-routes';
import { haTagRoutes } from '../ha-tag/ha-tag-routes';

export const haMainRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haAdminRoutes,
  },
  {
    path: 'bricks',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: haPublicRoutes,
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
  // {
  //   path: 'fair-open-access',
  //   component: HaMainComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: HaFairOpenAccessPageComponent,
  //     },
  //   ],
  // },
  {
    path: 'login',
    loadComponent: () =>
      import('./ha-login-page/ha-login-page.component').then((m) => m.HaLoginPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./ha-main/ha-main.component').then((m) => m.HaMainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./ha-home/ha-home.component').then((m) => m.HaHomeComponent),
      },
      {
        path: '404',
        loadComponent: () =>
          import('../ha-public/module/ha404/ha404.component').then((m) => m.Ha404Component),
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
