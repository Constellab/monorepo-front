import { Component, OnInit } from '@angular/core';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { combineLatestWith, Observable } from 'rxjs';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { map } from 'rxjs/operators';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaSpaceFormDialogComponent,
  CaSpaceFormDialogInput,
} from '../../../ca-core/entity-module/ca-space-core/component/ca-space-form-dialog/ca-space-form-dialog.component';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { CaSpaceSettingsDto } from '../../../ca-core/model/entities/space/ca-space.dto';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';

/**
 * Portal to list the space of the user with possibility to switch between them
 */
@Component({
    selector: 'ca-my-spaces-portal',
    templateUrl: './ca-my-spaces-portal.component.html',
    styleUrls: ['./ca-my-spaces-portal.component.scss'],
    standalone: false
})
export class CaMySpacesPortalComponent implements OnInit {
  currentSpace$: Observable<CaSpace>;
  currentSpaceRoute: string = CaRouterService.getCurrentSpaceRoute();

  otherSpaces: Observable<CaSpace[]>;

  appRoute = CaRouterService.getAppRoute();

  showCreateSpaceButton = this.authenticatedUserService.hasEntrepriseLicense();

  constructor(
    private spaceService: CaSpaceService,
    private currentSpaceService: CaCurrentSpaceService,
    private dialogService: FlDialogService,
    private authenticatedUserService: CaAuthenticatedUserService
  ) {}

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
