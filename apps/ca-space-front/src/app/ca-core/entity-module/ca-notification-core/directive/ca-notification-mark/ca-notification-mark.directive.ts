import { ChangeDetectorRef, Directive, HostBinding, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { mergeMap, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaNotificationType } from '../../../../model/entities/ca-notification.class';
import { CaNotificationState, CaNotificationStateFind } from '../../../../state/ca-notification.state';

@Directive({ selector: '[caNotificationMark]' })
export class CaNotificationMarkDirective implements OnInit, OnDestroy {
  private notifState = inject(CaNotificationState);
  private changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Notification object id
   */
  @Input({ required: true }) caNotificationMark: string | Observable<string>;

  @Input() caNotificationObjectType: CaNotificationType;

  /**
   * Where to check parentObjectId or not
   * if null, check only the objectId
   * if > 0, check the associated object and the first n objects
   * if < 0, check all the associated objects
   */
  @Input() caNotificationAssociatedObjectIds: number = null;

  @Input() caNotificationMarkDisabled: boolean = false;

  private subscription: Subscription;

  @HostBinding('class.g-notification-mark')
  markShown: boolean = false;

  ngOnInit(): void {
    if (this.caNotificationMarkDisabled) return;
    const objectId$: Observable<string> =
      typeof this.caNotificationMark === 'string' ? of(this.caNotificationMark) : this.caNotificationMark;

    const options: Observable<CaNotificationStateFind> = objectId$.pipe(
      map((objectId) => {
        // reset the mark
        this.onChange(false);

        const options: CaNotificationStateFind = {
          objectId: objectId,
          objectType: this.caNotificationObjectType,
          checkAssociatedObjects: this.caNotificationAssociatedObjectIds,
        };

        // if we include parent object, this means the directive is placed on a parent object
        // so this is only for indication and we don't want to mark the notification as read
        if (this.caNotificationAssociatedObjectIds == null) {
          this.notifState.markNotifAsRead(options);
        }

        return options;
      })
    );

    this.subscription = options
      .pipe(mergeMap((options) => this.notifState.entityHasNotReadNotification(options)))
      .subscribe((hasNotif: boolean) => this.onChange(hasNotif));
  }

  private onChange(hasNotif: boolean): void {
    if (hasNotif === this.markShown) return;
    this.markShown = hasNotif;
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
