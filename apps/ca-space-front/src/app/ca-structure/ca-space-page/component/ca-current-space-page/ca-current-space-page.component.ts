import { Component, inject, OnInit } from '@angular/core';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { Observable } from 'rxjs';
import { CaSpace } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaCurrentSpaceService } from '../../../../ca-core/service-api/ca-current-space.service';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ca-current-space-page',
  templateUrl: './ca-current-space-page.component.html',
  styleUrls: ['./ca-current-space-page.component.scss'],
  imports: [FlHorizontalNavBarModule, RouterOutlet, AsyncPipe],
})
export class CaCurrentSpacePageComponent implements OnInit {
  private currentSpaceService = inject(CaCurrentSpaceService);

  space$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();

  routes: FlHorizontalNavBarItem[] = [
    {
      label: { text: 'admin_dashboard_page', translateText: true },
      icon: 'dashboard',
      route: CaRouterService.getCurrentSpaceRoute(),
      linkActiveExact: true,
    },
    {
      label: { text: 'space_users', translateText: true },
      icon: 'people',
      route: CaRouterService.getCurrentSpaceUsersRoute(),
    },
  ];

  ngOnInit(): void {
    // add route for admin
    if (this.currentSpaceService.isSpaceAdmin()) {
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
    }
  }
}
