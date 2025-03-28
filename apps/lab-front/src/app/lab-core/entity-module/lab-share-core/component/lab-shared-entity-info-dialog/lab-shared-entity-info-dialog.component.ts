import { Component, inject, OnInit } from '@angular/core';
import {
  LabSharedEntityDatasource,
  LabShareLink,
  LabShareLinkEntityType,
} from '../../../../model/entities/lab-share.entity';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import {
  LabShareLinkFormDialogComponent,
  LabShareLinkFormDialogInput,
} from '../lab-share-link-form-dialog/lab-share-link-form-dialog.component';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { Observable, of, share } from 'rxjs';
import { LabShareService } from '../../../../entity-service/lab-share.service';
import { LabShareLinkService } from '../../../../entity-service/lab-share-link.service';
import {
  LabQuickConfigureProcessDialogComponent,
  LabQuickConfigureProcessDialogInput,
} from '../../../lab-process-core/component/lab-quick-configure-process-dialog/lab-quick-configure-process-dialog.component';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabShareResourceWithSpaceDialogComponent,
  LabShareResourceWithSpaceDialogInput,
} from '../../../lab-resource-core/component/lab-share-resource-with-space-dialog/lab-share-resource-with-space-dialog.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { LabShareLinkActionsMenuComponent } from '../lab-share-link-actions-menu/lab-share-link-actions-menu.component';
import { LabShareLinkLinksComponent } from '../lab-share-link-links/lab-share-link-links.component';
import { AsyncPipe } from '@angular/common';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { LabSharedEntityTableComponent } from '../lab-shared-entity-table/lab-shared-entity-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LabShareLinkInfoComponent } from '../lab-share-link-info/lab-share-link-info.component';

export interface LabSharedEntityInfoDialogInput {
  entityType: LabShareLinkEntityType;
  entityId: string;
  /**
   * Config to enable auto send to lab button and dialog
   */
  autoSendConfig: LabQuickConfigureProcessDialogInput;
  autoSend: (specs: TdParamSpecs) => Observable<any>;

  shareResourceWithSpaceConfig?: {
    resource: LabResource;
  };
}

@Component({
  selector: 'lab-shared-entity-info-dialog',
  templateUrl: './lab-shared-entity-info-dialog.component.html',
  styleUrls: ['./lab-shared-entity-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    MatDialogContent,
    MatButton,
    MatDivider,
    LabShareLinkActionsMenuComponent,
    LabShareLinkLinksComponent,
    FlUserModule,
    FlDateModule,
    FlIconModule,
    FlInfiniteScrollModule,
    LabSharedEntityTableComponent,
    AsyncPipe,
    TranslatePipe,
    LabShareLinkInfoComponent,
  ],
})
export class LabSharedEntityInfoDialogComponent implements OnInit {
  private shareService = inject(LabShareService);
  private shareLinkService = inject(LabShareLinkService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  input: LabSharedEntityInfoDialogInput = inject(MAT_DIALOG_DATA);

  sharedEntities: LabSharedEntityDatasource;

  publicShareLink$: Observable<LabShareLink> = this.shareLinkService
    .getShareLink(this.input.entityType, this.input.entityId, 'PUBLIC')
    .pipe(share());

  spaceShareLink$: Observable<LabShareLink> = this.shareLinkService
    .getShareLink(this.input.entityType, this.input.entityId, 'SPACE')
    .pipe(share());

  ngOnInit(): void {
    this.sharedEntities = this.shareService.getSharedToDatasource(this.input.entityType, this.input.entityId);
  }

  openShareDialog(): void {
    const data: LabShareLinkFormDialogInput = {
      mode: 'create',
      entityType: this.input.entityType,
      entityId: this.input.entityId,
      createTitle: this.getShareDialogTitle(),
    };

    this.dialogService
      .openSmallDialog(LabShareLinkFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((shareLink: LabShareLink) => this.onShareClosedClosed(shareLink));
  }

  private onShareClosedClosed(shareLink?: LabShareLink): void {
    if (shareLink) {
      this.onPublicShareLinkUpdate(shareLink);
    }
  }

  private getShareDialogTitle(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'biox.share_resource';
      case 'SCENARIO':
        return 'biox.share_scenario';
      default:
        throw new Error('Unknown entity type');
    }
  }

  get sendToLabButtonText(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'biox.send_resource_to_lab';
      case 'SCENARIO':
        return 'biox.send_scenario_to_lab';
      default:
        throw new Error('Unknown entity type');
    }
  }

  onPublicShareLinkUpdate(entity: LabShareLink): void {
    this.publicShareLink$ = of(entity);
  }

  onSpaceShareLinkUpdate(entity: LabShareLink): void {
    this.spaceShareLink$ = of(entity);
  }

  onPublicShareLinkDelete(): void {
    this.publicShareLink$ = of(null);
  }

  onSpaceShareLinkDelete(): void {
    this.spaceShareLink$ = of(null);
  }

  openAutoSendDialog(): void {
    this.dialogService
      .openMediumDialog(LabQuickConfigureProcessDialogComponent, { data: this.input.autoSendConfig })
      .afterClosed()
      .subscribe((specs) => this.onAutoSendClosed(specs));
  }

  private getSendActionText(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'biox.sending_resource_to_lab';
      case 'SCENARIO':
        return 'biox.sending_scenario_to_lab';
      default:
        throw new Error('Unknown entity type');
    }
  }

  private onAutoSendClosed(specs: TdParamSpecs): void {
    if (specs) {
      const action: FlPortalAction = {
        text: this.getSendActionText(),
        action: this.input.autoSend(specs),
        type: 'send-to-lab',
      };
      this.actionService.addAction(action, false);
    }
  }

  shareResourceWithSpace(): void {
    const input: LabShareResourceWithSpaceDialogInput = {
      resource: this.input.shareResourceWithSpaceConfig.resource,
    };

    this.dialogService
      .openSmallDialog(LabShareResourceWithSpaceDialogComponent, { data: input })
      .afterClosed()
      .subscribe((shareLink: LabShareLink) => this.onShareWithSpaceClosed(shareLink));
  }

  private onShareWithSpaceClosed(shareLink: LabShareLink): void {
    if (shareLink) {
      this.onSpaceShareLinkUpdate(shareLink);
    }
  }
}
