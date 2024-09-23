import { Component, OnInit } from '@angular/core';
import {
  CaNotification,
  CaNotificationDatasourcePaginated,
  CaNotificationType
} from '../../ca-core/model/entities/ca-notification.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { CaNotificationState } from '../../ca-core/state/ca-notification.state';


@Component({
  selector: 'ca-notifications-portal',
  templateUrl: './ca-notifications-portal.component.html',
  styleUrls: ['./ca-notifications-portal.component.scss']
})
export class CaNotificationsPortalComponent implements OnInit {

  notifications: CaNotificationDatasourcePaginated = this.notificationState.notifications;

  constructor(private notificationState: CaNotificationState) {
  }

  ngOnInit(): void {
  }

  markAsRead(notification: CaNotification): void {
    this.notificationState.markNotifAsRead({id: notification.id});
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
      case 'EXPERIMENT':
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
