import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlExpansionMenuModule } from '@monorepo/front-core-lib/fl-expansion-menu';
import { FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaAuthenticatedUserInlineComponent
} from '../../../ca-core/entity-module/ca-user-core/component/ca-authenticated-user-inline/ca-authenticated-user-inline.component';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { CaNotificationState } from '../../../ca-core/state/ca-notification.state';
import {
  CaNotificationsPortalComponent,
} from '../../../ca-notifications/ca-notifications-portal/ca-notifications-portal.component';
import { CaMainMenuLink, caMainMenuLinks } from '../../model/ca-main-menu-link.class';
import { CaMySpacesPortalComponent } from '../ca-my-spaces-portal/ca-my-spaces-portal.component';

/**
 * Main app component. Menu on the left and page on the right
 */
@Component({
  selector: 'ca-main-app',
  templateUrl: './ca-main-app.component.html',
  styleUrls: ['./ca-main-app.component.scss'],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    FlExpansionMenuModule,
    NgClass,
    MatBadge,
    FlCoreDirectiveModule,
    NgOptimizedImage,
    MatAnchor,
    RouterLinkActive,
    RouterLink,
    MatTooltip,
    MatIcon,
    FlIconModule,
    MatButton,
    CaAuthenticatedUserInlineComponent,
    MatSidenavContent,
    RouterOutlet,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaMainAppComponent implements OnInit {
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private currentSpaceService = inject(CaCurrentSpaceService);
  private portalService = inject(FlPortalService);
  private notificationState = inject(CaNotificationState);

  @ViewChild(MatSidenav, { static: true, read: ElementRef }) sidenav: ElementRef<HTMLElement>;

  menuExpanded: boolean = true;

  spaceLogo$: Observable<string>;
  spaceName$: Observable<string>;

  accessibleLinks: CaMainMenuLink[];

  numberOfNotifications$: Observable<string | number>;

  otherSpaceNotificationsNumber$: Observable<string>;

  ngOnInit(): void {
    this.initAccessibleLinks();

    // if the current space has a photo, use it, otherwise, use the default logo of gencovery
    this.spaceLogo$ = this.currentSpaceService
      .getCurrentSpacePhoto$()
      .pipe(map((photo) => photo ?? 'assets/fl-logo/constellab-logo.svg'));
    this.spaceName$ = this.currentSpaceService.getCurrentSpace$().pipe(map((space) => space?.name ?? null));
    this.notificationState.init();

    this.numberOfNotifications$ = this.notificationState.getNotReadNotificationsNumber();
    this.otherSpaceNotificationsNumber$ = this.notificationState.getOtherSpacesNotificationsCount$();
  }

  private initAccessibleLinks(): void {
    const accessibleLinks: CaMainMenuLink[] = [];
    for (const link of caMainMenuLinks) {
      // if the user doesn't have access to the link
      if (
        link.authorizedCategories &&
        !this.authenticatedUserService.isCategory(...link.authorizedCategories)
      ) {
        continue;
      }
      accessibleLinks.push(link);
    }

    this.accessibleLinks = accessibleLinks;
  }

  openMySpacesPortal(): void {
    const config = this.portalService.configureRelativePortal(
      this.sidenav.nativeElement,
      [
        {
          originX: 'end',
          overlayX: 'start',
          originY: 'top',
          overlayY: 'top',
        },
      ],
      {
        disposeOnOutsideClick: true,
        disposeOnNavigation: true,
      }
    );

    this.portalService.createPortal(CaMySpacesPortalComponent, config);
  }

  openNotificationDiv(): void {
    const config: FlPortalConfig = this.portalService.configureAbsolutePortal(
      {
        bottom: '4.5em',
        left: '5em',
      },
      {
        disposeOnNavigation: true,
        disposeOnOutsideClick: true,
      }
    );

    this.portalService.createPortal(CaNotificationsPortalComponent, config).detachments().subscribe();
  }
}
