import { Component } from '@angular/core';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Global page for admin
 */
@Component({
  selector: 'ca-admin-page',
  templateUrl: './ca-admin-page.component.html',
  styleUrls: ['./ca-admin-page.component.scss'],
  imports: [FlHorizontalNavBarModule, FlTextIconModule, MatIcon, RouterOutlet, TranslatePipe],
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
      label: { text: 'mails', translateText: true },
      icon: 'email',
      route: CaRouterService.getAdminMailsRoute(),
    },
    {
      label: { text: 'admin_other_page', translateText: true },
      icon: 'settings',
      route: CaRouterService.getAdminServersRoute(),
    },
  ];
}
