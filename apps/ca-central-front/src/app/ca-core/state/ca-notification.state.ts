import { Injectable, OnDestroy } from '@angular/core';
import { CaNotificationsService } from '../service-api/ca-notifications.service';
import {
  CaNotification,
  CaNotificationCountBySpace,
  CaNotificationDatasourcePaginated,
  CaNotificationType,
} from '../model/entities/ca-notification.class';
import { BehaviorSubject, debounceTime, mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaCurrentSpaceService } from '../service-api/ca-current-space.service';
import { CaSpace } from '../model/entities/space/ca-space.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { ClCachedObservable } from '@monorepo/core-lib';

export interface CaNotificationStateFind {
  id?: string;
  objectId?: string;
  objectType?: CaNotificationType;
  /**
   * Where to check parentObjectId or not
   * if null, check only the objectId
   * if > 0, check the associated object and the first n objects
   * if < 0, check all the associated objects
   */
  checkAssociatedObjects?: number;
  isRead?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CaNotificationState implements OnDestroy {
  public notifications: CaNotificationDatasourcePaginated;

  public notificationsBySpace$: ClCachedObservable<CaNotificationCountBySpace[]>;

  // use to mark notification per batch
  private notifToRead$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  private readonly notificationMarkDebounceTime: number = 5000;

  private readonly pageSize: number = 40;

  constructor(
    private notificationService: CaNotificationsService,
    private currentSpaceService: CaCurrentSpaceService
  ) {
    this.notifications = new FlEntityPaginatedDatasource(
      (page, size) => notificationService.getCurrentNotifications(page, size),
      this.pageSize,
      {
        disableAutoDisconnect: true,
      }
    );
  }

  public init(): void {
    this.notifToRead$
      .pipe(debounceTime(this.notificationMarkDebounceTime))
      .subscribe((notifIds: string[]) => this.markNotificationsAsRead(notifIds));
    this.notificationsBySpace$ = new ClCachedObservable(this.notificationService.getNotReadBySpace());
  }

  private markNotificationsAsRead(notifIds: string[]): void {
    if (notifIds?.length > 0) {
      this.notificationService.readNotifications(notifIds).subscribe();
      this.notifToRead$.next([]);

      // refresh the reads of the notifications
      const currentNotifications = this.notifications.array;

      for (const notif of currentNotifications) {
        if (notifIds.includes(notif.id)) {
          notif.isRead = true;
        }
      }
      this.notifications.updateItem(currentNotifications);
    }
  }

  private getNotReadNotifications(): Observable<CaNotification[]> {
    return this.notifications
      .connect()
      .pipe(
        map((notifications: CaNotification[]) =>
          notifications.filter((notif: CaNotification) => !notif.isRead)
        )
      );
  }

  public getNotReadNotificationsNumber(): Observable<number | string> {
    return this.getNotReadNotifications().pipe(
      map((notifications: CaNotification[]) => {
        if (notifications.length === 0) {
          return '';
        }
        // if all the notif are not loaded yet, we add a '+' to the number
        else if (notifications.length % this.pageSize === 0) {
          return notifications.length + '+';
        } else {
          return notifications.length;
        }
      })
    );
  }

  public countEntityNotReadNotifications(options: CaNotificationStateFind): Observable<number> {
    return this.getNotReadNotifications().pipe(
      map((notifications: CaNotification[]) => {
        notifications = this.filterNotifications(notifications, options);
        if (notifications.length > 0) {
          return notifications.length;
        } else {
          return 0;
        }
      })
    );
  }

  public entityHasNotReadNotification(options: CaNotificationStateFind): Observable<boolean> {
    return this.countEntityNotReadNotifications(options).pipe(map((count: number) => count > 0));
  }

  private filterNotifications(
    notifications: CaNotification[],
    options: CaNotificationStateFind
  ): CaNotification[] {
    if (options.id) {
      return notifications.filter((notif) => notif.id === options.id);
    }
    if (options.objectType) {
      notifications = notifications.filter((notif) => notif.objectType === options.objectType);
    }

    if (options.isRead != null) {
      notifications = notifications.filter((notif) => notif.isRead === options.isRead);
    }

    if (options.objectId) {
      if (options.checkAssociatedObjects != null) {
        return notifications.filter((notif) => {
          const parentObjectIds = notif.associatedObjectIds ?? [];
          const limit =
            options.checkAssociatedObjects < 0
              ? parentObjectIds.length
              : Math.min(options.checkAssociatedObjects, parentObjectIds.length);
          const limitParents = parentObjectIds.slice(0, limit);
          return notif.objectId === options.objectId || limitParents.includes(options.objectId);
        });
      } else {
        return notifications.filter((notif) => notif.objectId === options.objectId);
      }
    }
    return notifications;
  }

  public markNotifAsRead(options: CaNotificationStateFind): void {
    // only select not read notifications
    options.isRead = false;
    const notifications = this.filterNotifications(this.notifications.array, options);
    if (notifications.length > 0) {
      const notifIds = [...this.notifToRead$.value, ...notifications.map((n: CaNotification) => n.id)];
      // remove duplicates
      this.notifToRead$.next([...new Set(notifIds)]);
    }
  }

  public markAllAsRead(): void {
    const notifications = this.notifications.array;
    for (const notif of notifications) {
      notif.isRead = true;
    }
    this.notifications.array = notifications;
    this.notificationService.markAllNotificationsAsRead().subscribe();
  }

  ///////////////////// OTHER SPACES NOTIFICATIONS ///////////////////////

  public getSpaceNotificationCount(spaceId: string): Observable<string> {
    return this.notificationsBySpace$.getObs().pipe(
      map((notifications: CaNotificationCountBySpace[]) => {
        const notif = notifications.find((notif) => notif.spaceId === spaceId);
        const count = notif?.notReadCount ?? 0;
        return count === 0 ? '' : count.toString();
      })
    );
  }

  public getOtherSpacesNotificationsCount$(): Observable<string> {
    return this.currentSpaceService
      .getCurrentSpace$()
      .pipe(
        mergeMap((space: CaSpace) =>
          this.notificationsBySpace$
            .getObs()
            .pipe(map((notifications) => this.countOtherSpacesNotifications(space.id, notifications)))
        )
      );
  }

  private countOtherSpacesNotifications(
    currentSpaceId: string,
    notifications: CaNotificationCountBySpace[]
  ): string {
    const count = notifications
      .filter((notif) => notif.spaceId !== currentSpaceId)
      .reduce((acc, notif) => acc + notif.notReadCount, 0);
    return count === 0 ? '' : count.toString();
  }

  ngOnDestroy(): void {
    this.notifications.disconnect();
    this.notifToRead$.complete();
  }
}
