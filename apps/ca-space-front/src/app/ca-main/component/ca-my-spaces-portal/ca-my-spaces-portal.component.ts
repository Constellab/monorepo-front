import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatestWith, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaSpaceFormDialogComponent,
  CaSpaceFormDialogInput,
} from '../../../ca-core/entity-module/ca-space-core/component/ca-space-form-dialog/ca-space-form-dialog.component';
import {
  CaSpaceInlineComponent,
} from '../../../ca-core/entity-module/ca-space-core/component/ca-space-inline/ca-space-inline.component';
import {
  CaSpacePhotoComponent,
} from '../../../ca-core/entity-module/ca-space-core/component/ca-space-photo/ca-space-photo.component';
import {
  CaExternalSpaceLinkDirective,
} from '../../../ca-core/entity-module/ca-space-core/pipe/ca-external-space-link.directive';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { CaSpaceSettingsDto } from '../../../ca-core/model/entities/space/ca-space.dto';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';

/**
 * Portal to list the space of the user with possibility to switch between them
 */
@Component({
  selector: 'ca-my-spaces-portal',
  templateUrl: './ca-my-spaces-portal.component.html',
  styleUrls: ['./ca-my-spaces-portal.component.scss'],
  imports: [
    FlPortalModule,
    RouterLink,
    CaSpacePhotoComponent,
    MatDivider,
    FlTextIconModule,
    MatIcon,
    FlSectionModule,
    CaExternalSpaceLinkDirective,
    CaSpaceInlineComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaMySpacesPortalComponent implements OnInit {
  private spaceService = inject(CaSpaceService);
  private currentSpaceService = inject(CaCurrentSpaceService);
  private dialogService = inject(FlDialogService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  currentSpace$: Observable<CaSpace>;
  currentSpaceRoute: string = CaRouterService.getCurrentSpaceRoute();

  otherSpaces: Observable<CaSpace[]>;

  appRoute = CaRouterService.getAppRoute();

  showCreateSpaceButton = this.authenticatedUserService.hasEntrepriseLicense();

  ngOnInit(): void {
    this.currentSpace$ = this.currentSpaceService.getCurrentSpace$();
    // list all the space of the user except from the current one
    this.otherSpaces = this.spaceService.getMySpaces().pipe(
      combineLatestWith(this.currentSpaceService.getCurrentSpace$()),
      map(([spaces, currentSpace]) => {
        return spaces.filter((space) => space.id !== currentSpace.id);
      })
    );
  }

  openCreateSpaceDialog(): void {
    const input: CaSpaceFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaSpaceFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((version) => this.onCreateSpaceClosed(version));
  }

  private onCreateSpaceClosed(spaceSettingsDto?: CaSpaceSettingsDto): void {
    if (spaceSettingsDto) {
      if (!CaEnvironmentHelper.isProduction()) {
        this.currentSpaceService.setCurrentSpaceDomainDev(spaceSettingsDto.space.domain);
      }
      window.location.href = CaRouterService.getSpaceDomainUrl(
        spaceSettingsDto.space.domain,
        CaRouterService.getAppRoute()
      );
    }
  }
}
