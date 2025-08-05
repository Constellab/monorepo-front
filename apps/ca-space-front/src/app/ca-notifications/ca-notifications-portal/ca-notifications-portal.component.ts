import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaNotification,
  CaNotificationDatasourcePaginated,
} from '../../ca-core/model/entities/ca-notification.class';
import { CaNotificationState } from '../../ca-core/state/ca-notification.state';
import { CaNotificationInfoComponent } from '../ca-notification-info/ca-notification-info.component';

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
    FlTextIconModule,
    FlIconModule,
    FlDateModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    CaNotificationInfoComponent,
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
}
