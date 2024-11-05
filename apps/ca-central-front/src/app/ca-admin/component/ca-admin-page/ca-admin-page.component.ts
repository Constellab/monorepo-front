import { Component } from '@angular/core';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { FlHorizontalNavBarItem } from '@monorepo/front-core-lib';

/**
 * Global page for admin
 */
@Component({
  selector: 'ca-admin-page',
  templateUrl: './ca-admin-page.component.html',
  styleUrls: ['./ca-admin-page.component.scss'],
})
export class CaAdminPageComponent {
  routes: FlHorizontalNavBarItem[] = [
    {
      label: { text: 'space_list', translateText: true },
      icon: 'space',
      route: CaRouterService.getAdminSpacesRoute(),
    },
    {
      label: { text: 'users', translateText: true },
      icon: 'people',
      route: CaRouterService.getAdminUsersRoute(),
    },
    {
      label: { text: 'labs', translateText: true },
      icon: 'lab',
      route: CaRouterService.getAdminLabsRoute(),
    },
    {
      label: { text: 'bucket_list', translateText: true },
      icon: 'folder',
      route: CaRouterService.getAdminBucketsRoute(),
    },
    {
      label: { text: 'servers', translateText: true },
      icon: 'dns',
      route: CaRouterService.getAdminServersInfoRoute(),
    },
    {
      label: { text: 'admin_other_page', translateText: true },
      icon: 'settings',
      route: CaRouterService.getAdminServersRoute(),
    },
  ];
}
