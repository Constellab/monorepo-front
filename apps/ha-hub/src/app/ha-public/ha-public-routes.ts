import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import {
  HaPublicBrickPageComponent
} from './module/ha-public-brick-page/ha-public-brick-page/ha-public-brick-page.component';
import {
  HaPublicBrickDescriptionComponent
} from './module/ha-public-brick-page/ha-public-brick-description/ha-public-brick-description.component';
import {
  HaPublicVersionsComponent
} from './module/ha-public-brick-page/ha-public-versions/ha-public-versions.component';
import {
  HaPublicTechDocComponent
} from './module/ha-public-brick-page/ha-public-tech-doc/ha-public-tech-doc.component';
import { HaPublicDocComponent } from './module/ha-public-brick-page/ha-public-doc/ha-public-doc.component';

export const haPublicRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import(
        './module/ha-public-bricks/ha-public-list-bricks-page/ha-public-list-bricks-page.component'
      ).then((m) => m.HaPublicListBricksPageComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./module/ha-public-bricks/ha-public-edit-brick-page/ha-public-edit-brick-page.component').then(
        (m) => m.HaPublicEditBrickPageComponent
      ),
    canActivate: [HaLoginGuard],
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import(
        './module/ha-public-brick-page/ha-public-brick-user-invite-page/ha-public-brick-user-invite-page.component'
      ).then((m) => m.HaPublicBrickUserInvitePageComponent),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':brickName/:version',
    component: HaPublicBrickPageComponent,
    children: [
      {
        path: '',
        component: HaPublicBrickDescriptionComponent,
      },
      {
        path: 'version',
        component: HaPublicVersionsComponent
      },
      {
        path: 'doc',
        children: [
          {
            path: 'technical-folder/:type/:uniqueName',
            component: HaPublicTechDocComponent
          },
          {
            path: '**',
            component: HaPublicDocComponent
          }
        ]
      }
    ]
  },
  // TODO FIX
  // {
  // component: HaPublicBrickPageComponent,
  // matcher: (url: UrlSegment[]) => {
  //   if (url.length === 1) {
  //     url.push(new UrlSegment('latest', {}));
  //   }
  //   return url.length >= 2 && (url[1].path.match(/^v\d+$/g) || url[1].path.match(/^latest$/g))
  //     ? {
  //         consumed: url.slice(0, 2),
  //         posParams: {
  //           brickName: new UrlSegment(url[0].path, {}),
  //           version: new UrlSegment(url[1].path, {}),
  //         },
  //       }
  //     : null;
  // },
  //   children: [
  //     {
  //       path: 'doc',
  //       children: [
  //         {
  //           path: 'technical-folder/:type/:uniqueName',
  //           component: HaPublicTechDocComponent,
  //         },
  //         {
  //           path: '**',
  //           component: HaPublicDocComponent,
  //         },
  //       ],
  //     },
  //     {
  //       path: 'version',
  //       component: HaPublicVersionsComponent,
  //     },
  //     {
  //       path: '',
  //       component: HaPublicBrickDescriptionComponent,
  //     },
  //   ],
  // },
  // {
  //   matcher: (url: UrlSegment[]) => {
  //     return url.length == 1
  //       ? {
  //           consumed: url.slice(0, 1),
  //           posParams: {
  //             brickName: new UrlSegment(url[0].path, {}),
  //           },
  //         }
  //       : null;
  //   },
  //   redirectTo: ':brickName/latest',
  // },
  {
    path: '**',
    loadComponent: () => import('./module/ha404/ha404.component').then((m) => m.Ha404Component),
  },
];
