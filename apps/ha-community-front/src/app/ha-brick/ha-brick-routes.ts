import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import { HaBrickDescriptionPageComponent } from './ha-brick-page/ha-brick-description-page/ha-brick-description-page.component';
import { HaBrickDocComponent } from './ha-brick-page/ha-brick-doc/ha-brick-doc.component';
import { HaBrickPageComponent } from './ha-brick-page/ha-brick-page/ha-brick-page.component';
import { HaBrickTechDocComponent } from './ha-brick-page/ha-brick-tech-doc/ha-brick-tech-doc.component';
import { HaBrickVersionsComponent } from './ha-brick-page/ha-brick-versions/ha-brick-versions.component';

export const haBrickRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ha-bricks/ha-list-bricks-page/ha-list-bricks-page.component').then(
        (m) => m.HaListBricksPageComponent
      ),
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import('./ha-brick-page/ha-brick-user-invite-page/ha-brick-user-invite-page.component').then(
        (m) => m.HaBrickUserInvitePageComponent
      ),
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
        component: HaBrickVersionsComponent,
      },
      {
        path: 'doc',
        children: [
          {
            path: 'technical-folder/:type/:uniqueName',
            component: HaBrickTechDocComponent,
          },
          {
            path: '**',
            component: HaBrickDocComponent,
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
