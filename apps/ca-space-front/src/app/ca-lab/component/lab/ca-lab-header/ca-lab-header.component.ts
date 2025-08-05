import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLab, CaLabStatus } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

/**
 * Header info about the lab in the detail page
 */
@Component({
  selector: 'ca-lab-header',
  templateUrl: './ca-lab-header.component.html',
  styleUrls: ['./ca-lab-header.component.scss'],
  imports: [FlHorizontalNavBarModule, FlTextIconModule, MatIcon, FlIconModule, FlStatusModule, AsyncPipe],
})
export class CaLabHeaderComponent {
  private state = inject(CaLabDetailPageState);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  lab$: Observable<CaLab> = this.state.getLab$();
  labStatus$: Observable<FlStatus<CaLabStatus>> = this.state
    .getSimpleStatus$()
    .pipe(map((status) => status.labStatus));

  navBarItems$: Observable<FlHorizontalNavBarItem[]> = combineLatest([
    this.state.getLab$(),
    this.state.isLabOwner$(),
  ]).pipe(map(([lab, isOwner]) => this.init(lab, isOwner)));

  private init(lab: CaLab, isOwner: boolean): FlHorizontalNavBarItem[] {
    const items: FlHorizontalNavBarItem[] = [
      {
        label: { text: 'dashboard', translateText: true },
        route: CaRouterService.getLabDetailRoute(lab.id),
        icon: 'dashboard',
        linkActiveExact: true,
      },
    ];

    if (isOwner && !lab.typeObj.isDesktop) {
      items.push({
        label: { text: 'lab_configuration', translateText: true },
        route: CaRouterService.getLabConfigRoute(lab.id),
        icon: 'settings',
      });
    }

    items.push({
      label: { text: 'lab_usage', translateText: true },
      route: CaRouterService.getLabUsageRoute(lab.id),
      icon: 'data_usage',
    });

    if (lab.typeObj.isCloud) {
      items.push({
        label: { text: 'lab_backup', translateText: true },
        route: CaRouterService.getLabBackupRoute(lab.id),
        icon: 'cloud_done',
      });
    }

    items.push({
      label: { text: 'status_history', translateText: true },
      route: CaRouterService.getLabStatusHistoryRoute(lab.id),
      icon: 'history',
    });

    if (this.authenticatedUserService.isCurrentSpaceAdmin()) {
      items.push({
        label: { text: 'lab_support', translateText: true },
        route: CaRouterService.getLabSupportRoute(lab.id),
        icon: 'support',
      });
    }

    return items;
  }
}
