import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { CaNotification, CaNotificationCountBySpace } from '../model/entities/ca-notification.class';
import { ClPage } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class CaNotificationsService {
  private readonly route = 'notification';

  constructor(private apiService: FlApiService) {}

  public getCurrentNotifications(page: number, size: number): Observable<ClPage<CaNotification>> {
    return this.apiService.get(`${this.route}`, CaNotification, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public markAllNotificationsAsRead(): Observable<void> {
    return this.apiService.post(`${this.route}/readAll`, null);
  }

  public read(notifId: string): Observable<void> {
    return this.apiService.post(`${this.route}/read/${notifId}`, null);
  }

  public readNotifications(notificationIds: string[]): Observable<void> {
    return this.apiService.post(`${this.route}/read`, notificationIds);
  }

  public getNotReadBySpace(): Observable<CaNotificationCountBySpace[]> {
    return this.apiService.get(`${this.route}/count-not-read-by-space`);
  }
}
