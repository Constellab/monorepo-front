import { Component, inject } from '@angular/core';
import {
  CaNotification,
  CaNotificationDatasourcePaginated,
  CaNotificationType,
} from '../../ca-core/model/entities/ca-notification.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { CaNotificationState } from '../../ca-core/state/ca-notification.state';
import { FlPortalModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-portal/fl-portal.module';
import { FlInfiniteScrollModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTextIconModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlDateModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-notifications-portal',
  templateUrl: './ca-notifications-portal.component.html',
  styleUrls: ['./ca-notifications-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlInfiniteScrollModule,
    MatDivider,
    RouterLink,
    FlUserModule,
    MatTooltip,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlDateModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaNotificationsPortalComponent {
  private notificationState = inject(CaNotificationState);

  notifications: CaNotificationDatasourcePaginated = this.notificationState.notifications;

  markAsRead(notification: CaNotification): void {
    this.notificationState.markNotifAsRead({ id: notification.id });
  }

  markAllNotificationsAsRead(): void {
    this.notificationState.markAllAsRead();
  }

  getNotificationLink(link: string): string {
    const l = link.split('?');
    return ClStringHelper.isHttpLink(l[0]) ? l[0] : l[0];
  }

  getNotificationQueryParams(link: string): { [query: string]: string } {
    const l = link.split('?');
    const qP: { [query: string]: string } = {};
    if (l[1]) {
      for (const query of l[1].split('&')) {
        const q = query.split('=');
        qP[q[0]] = q[1];
      }
    }
    return qP;
  }

  getNotificationObjectIcon(objectType: CaNotificationType): string {
    switch (objectType) {
      case 'DOCUMENT':
      case 'MESSAGE':
      case 'SCENARIO':
      case 'NOTE':
      case 'FOLDER':
        return 'folder';
      case 'USER':
        return 'people';
      default:
        return 'campaign';
    }
  }
}
