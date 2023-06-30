import {Component, OnInit} from '@angular/core';
import {CaRouterService} from '../../../ca-core/service/ca-router.service';
import {FlHorizontalNavBarItem} from '@monorepo/front-core-lib';

/**
 * Global page for admin
 */
@Component({
  selector: 'ca-admin-page',
  templateUrl: './ca-admin-page.component.html',
  styleUrls: ['./ca-admin-page.component.scss']
})
export class CaAdminPageComponent implements OnInit {

  routes: FlHorizontalNavBarItem[] = [
    {
      label: {text: 'admin_dashboard_page', translateText: true},
      icon: 'dashboard',
      route: CaRouterService.getAdminRoute(),
      linkActiveExact: true
    },
    {
      label: {text: 'space_list', translateText: true},
      icon: 'space',
      route: CaRouterService.getAdminSpacesRoute()
    },
    {
      label: {text: 'users', translateText: true},
      icon: 'people',
      route: CaRouterService.getAdminUsersRoute()
    },
    {
      label: {text: 'lab_instances', translateText: true},
      icon: 'lab',
      route: CaRouterService.getAdminLabsRoute()
    },
    {
      label: {text: 'admin_servers_page', translateText: true},
      icon: 'dns',
      route: CaRouterService.getAdminServersRoute()
    },
    {
      label: {text: 'bucket_list', translateText: true},
      icon: 'folder',
      route: CaRouterService.getAdminBucketsRoute()
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
