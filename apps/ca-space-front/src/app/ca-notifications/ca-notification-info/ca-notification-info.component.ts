import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { CaNotification } from '../../ca-core/model/entities/ca-notification.class';

@Component({
  selector: 'ca-notification-info',
  imports: [
    FlPortalModule,
    FlInfiniteScrollModule,
    FlUserModule,
    MatTooltip,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlDateModule,
    FlCorePipeModule,
  ],
  templateUrl: './ca-notification-info.component.html',
  styleUrl: './ca-notification-info.component.scss',
})
export class CaNotificationInfoComponent {
  notification = input.required<CaNotification>();

  notificationIcon = computed(() => this.notification().getObjectIcon());
}
