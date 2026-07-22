import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLab, CaLabStatus } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

/** Colored status badge shown in the header nav bar. */
interface CaLabStatusBadge {
  label: string;
  variant: 'primary' | 'warn' | 'accent';
}

/** Lab statuses considered "running" (badge shown in primary color). */
const RUNNING_STATUSES: CaLabStatus[] = ['LAB_RUNNING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'];

/**
 * Header info about the lab in the detail page
 */
@Component({
  selector: 'ca-lab-header',
  templateUrl: './ca-lab-header.component.html',
  styleUrls: ['./ca-lab-header.component.scss'],
  imports: [FlHorizontalNavBarModule, FlTextIconModule, MatIcon, FlIconModule, AsyncPipe, TranslatePipe],
})
export class CaLabHeaderComponent {
  private state = inject(CaLabDetailPageState);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  lab$: Observable<CaLab> = this.state.getLab$();

  /** Colored dot + label badge summarizing the lab status. */
  labBadge$: Observable<CaLabStatusBadge> = this.state
    .getSimpleStatus$()
    .pipe(map((status) => this.buildBadge(status.labStatus.value, status.labStatus.name)));

  private buildBadge(value: CaLabStatus, name: string): CaLabStatusBadge {
    let variant: CaLabStatusBadge['variant'] = 'accent';
    if (value === 'ERROR') {
      variant = 'warn';
    } else if (RUNNING_STATUSES.includes(value)) {
      variant = 'primary';
    }
    return { label: name, variant };
  }

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
