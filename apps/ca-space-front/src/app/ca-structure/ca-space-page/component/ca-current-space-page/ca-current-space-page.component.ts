import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { Observable } from 'rxjs';

import { CaSpace } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaCurrentSpaceService } from '../../../../ca-core/service-api/ca-current-space.service';

@Component({
  selector: 'ca-current-space-page',
  templateUrl: './ca-current-space-page.component.html',
  styleUrls: ['./ca-current-space-page.component.scss'],
  imports: [FlHorizontalNavBarModule, RouterOutlet, AsyncPipe],
})
export class CaCurrentSpacePageComponent implements OnInit {
  private currentSpaceService = inject(CaCurrentSpaceService);
  private router = inject(Router);

  space$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();

  routes: FlHorizontalNavBarItem[] = [];

  ngOnInit(): void {
    const isAdmin = this.currentSpaceService.isSpaceAdmin();

    if (isAdmin) {
      this.routes.push({
        label: { text: 'admin_dashboard_page', translateText: true },
        icon: 'dashboard',
        route: CaRouterService.getCurrentSpaceRoute(),
        linkActiveExact: true,
      });
    }

    this.routes.push({
      label: { text: 'space_users', translateText: true },
      icon: 'people',
      route: CaRouterService.getCurrentSpaceUsersRoute(),
    });

    if (isAdmin) {
      this.routes.push(
        {
          label: { text: 'labs', translateText: true },
          icon: 'lab',
          route: CaRouterService.getCurrentSpaceLabsRoute(),
        },
        {
          label: { text: 'folders', translateText: true },
          icon: 'folder',
          route: CaRouterService.getCurrentSpaceFoldersRoute(),
        },
        {
          label: { text: 'teams', translateText: true },
          icon: 'group',
          route: CaRouterService.getCurrentSpaceTeamsRoute(),
        },
        {
          label: { text: 'admin_other_page', translateText: true },
          icon: 'settings',
          route: CaRouterService.getCurrentSpaceOtherRoute(),
        }
      );
    } else {
      // non-admin users only see the users tab, redirect from dashboard
      this.router.navigate([CaRouterService.getCurrentSpaceUsersRoute()], { replaceUrl: true });
    }
  }
}
