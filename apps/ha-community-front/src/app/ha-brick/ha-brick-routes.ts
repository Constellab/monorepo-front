import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import {
  HaBrickDescriptionPageComponent
} from './ha-brick-page/ha-brick-description-page/ha-brick-description-page.component';
import {
  HaBrickPageComponent
} from './ha-brick-page/ha-brick-page/ha-brick-page.component';
import { HaPublicDocComponent } from './ha-brick-page/ha-public-doc/ha-public-doc.component';
import { HaPublicTechDocComponent } from './ha-brick-page/ha-public-tech-doc/ha-public-tech-doc.component';
import { HaPublicVersionsComponent } from './ha-brick-page/ha-public-versions/ha-public-versions.component';

export const haBrickRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import(
        './ha-bricks/ha-list-bricks-page/ha-list-bricks-page.component'
      ).then((m) => m.HaListBricksPageComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./ha-bricks/ha-edit-brick-page/ha-edit-brick-page.component').then(
        (m) => m.HaEditBrickPageComponent
      ),
    canActivate: [HaLoginGuard],
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './ha-brick-page/ha-brick-user-invite-page/ha-brick-user-invite-page.component'
      ).then((m) => m.HaBrickUserInvitePageComponent),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':brickName/:version',
    component: HaBrickPageComponent,
    children: [
      {
        path: '',
        component: HaBrickDescriptionPageComponent,
      },
      {
        path: 'version',
        component: HaPublicVersionsComponent,
      },
      {
        path: 'doc',
        children: [
          {
            path: 'technical-folder/:type/:uniqueName',
            component: HaPublicTechDocComponent,
          },
          {
            path: '**',
            component: HaPublicDocComponent,
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('../ha404/ha404.component').then((m) => m.Ha404Component),
  },
];
