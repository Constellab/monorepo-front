import { Route } from '@angular/router';

import { HaLoginGuard } from '../ha-core/ha-guard/ha-login.guard';
import {
  HaBrickDescriptionComponent
} from '../ha-brick/ha-brick-page/ha-brick-description/ha-brick-description.component';
import {
  HaBrickPageComponent
} from '../ha-brick/ha-brick-page/ha-brick-page/ha-brick-page.component';
import { HaPublicDocComponent } from '../ha-brick/ha-brick-page/ha-public-doc/ha-public-doc.component';
import {
  HaPublicTechDocComponent
} from '../ha-brick/ha-brick-page/ha-public-tech-doc/ha-public-tech-doc.component';
import {
  HaPublicVersionsComponent
} from '../ha-brick/ha-brick-page/ha-public-versions/ha-public-versions.component';

export const haPublicRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../ha-brick/ha-bricks/ha-list-bricks-page/ha-list-bricks-page.component'
      ).then((m) => m.HaListBricksPageComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('../ha-brick/ha-bricks/ha-edit-brick-page/ha-edit-brick-page.component').then(
        (m) => m.HaEditBrickPageComponent
      ),
    canActivate: [HaLoginGuard],
  },
  {
    path: 'invite/:token',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        '../ha-brick/ha-brick-page/ha-brick-user-invite-page/ha-brick-user-invite-page.component'
      ).then((m) => m.HaBrickUserInvitePageComponent),
    canActivate: [HaLoginGuard],
  },
  {
    path: ':brickName/:version',
    component: HaBrickPageComponent,
    children: [
      {
        path: '',
        component: HaBrickDescriptionComponent,
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
  // TODO FIX
  // {
  // component: HaBrickPageComponent,
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
  //       component: HaBrickDescriptionComponent,
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
    loadComponent: () => import('../ha404/ha404.component').then((m) => m.Ha404Component),
  },
];
