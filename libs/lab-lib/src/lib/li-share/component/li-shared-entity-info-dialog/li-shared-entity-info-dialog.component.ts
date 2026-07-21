import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiResource,
  LiSharedEntityDatasource,
  LiShareLink,
  LiShareLinkEntityType,
  LiShareLinkService,
  LiShareService,
} from '@monorepo/lab-lib/li-core';
import {
  LiQuickConfigureProcessDialogComponent,
  LiQuickConfigureProcessDialogInput,
} from '@monorepo/lab-lib/li-process';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of, share } from 'rxjs';

import { LiShareLinkActionsMenuComponent } from '../li-share-link-actions-menu/li-share-link-actions-menu.component';
import {
  LiShareLinkFormDialogComponent,
  LiShareLinkFormDialogInput,
} from '../li-share-link-form-dialog/li-share-link-form-dialog.component';
import { LiShareLinkInfoComponent } from '../li-share-link-info/li-share-link-info.component';
import { LiShareLinkLinksComponent } from '../li-share-link-links/li-share-link-links.component';
import {
  LiShareResourceWithSpaceDialogComponent,
  LiShareResourceWithSpaceDialogInput,
} from '../li-share-resource-with-space-dialog/li-share-resource-with-space-dialog.component';
import { LiSharedEntityTableComponent } from '../li-shared-entity-table/li-shared-entity-table.component';

export interface LiSharedEntityInfoDialogInput {
  entityType: LiShareLinkEntityType;
  entityId: string;
  /**
   * Config to enable auto send to lab button and dialog
   */
  autoSendConfig: LiQuickConfigureProcessDialogInput;
  autoSend: (specs: TdParamSpecs) => Observable<any>;

  shareResourceWithSpaceConfig?: {
    resource: LiResource;
  };
}

/**
 * Action type for sending an entity to another lab.
 */
const LI_SEND_TO_LAB_ACTION = 'send-to-lab';

@Component({
  selector: 'li-shared-entity-info-dialog',
  templateUrl: './li-shared-entity-info-dialog.component.html',
  styleUrls: ['./li-shared-entity-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    MatDialogContent,
    MatButton,
    MatDivider,
    LiShareLinkActionsMenuComponent,
    LiShareLinkLinksComponent,
    FlUserModule,
    FlDateModule,
    FlIconModule,
    FlInfiniteScrollModule,
    LiSharedEntityTableComponent,
    AsyncPipe,
    TranslatePipe,
    LiShareLinkInfoComponent,
  ],
})
export class LiSharedEntityInfoDialogComponent implements OnInit {
  private shareService = inject(LiShareService);
  private shareLinkService = inject(LiShareLinkService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  input: LiSharedEntityInfoDialogInput = inject(MAT_DIALOG_DATA);

  sharedEntities: LiSharedEntityDatasource;

  publicShareLink$: Observable<LiShareLink> = this.shareLinkService
    .getShareLink(this.input.entityType, this.input.entityId, 'PUBLIC')
    .pipe(share());

  spaceShareLink$: Observable<LiShareLink> = this.shareLinkService
    .getShareLink(this.input.entityType, this.input.entityId, 'SPACE')
    .pipe(share());

  ngOnInit(): void {
    this.sharedEntities = this.shareService.getSharedToDatasource(this.input.entityType, this.input.entityId);
  }

  openShareDialog(): void {
    const data: LiShareLinkFormDialogInput = {
      mode: 'create',
      entityType: this.input.entityType,
      entityId: this.input.entityId,
      createTitle: this.getShareDialogTitle(),
    };

    this.dialogService
      .openSmallDialog(LiShareLinkFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((shareLink: LiShareLink) => this.onShareClosedClosed(shareLink));
  }

  private onShareClosedClosed(shareLink?: LiShareLink): void {
    if (shareLink) {
      this.onPublicShareLinkUpdate(shareLink);
    }
  }

  private getShareDialogTitle(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'li.share_resource';
      case 'SCENARIO':
        return 'li.share_scenario';
      default:
        throw new Error('Unknown entity type');
    }
  }

  get sendToLabButtonText(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'li.send_resource_to_lab';
      case 'SCENARIO':
        return 'li.send_scenario_to_lab';
      default:
        throw new Error('Unknown entity type');
    }
  }

  onPublicShareLinkUpdate(entity: LiShareLink): void {
    this.publicShareLink$ = of(entity);
  }

  onSpaceShareLinkUpdate(entity: LiShareLink): void {
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
      .openMediumDialog(LiQuickConfigureProcessDialogComponent, { data: this.input.autoSendConfig })
      .afterClosed()
      .subscribe((specs) => this.onAutoSendClosed(specs));
  }

  private getSendActionText(): string {
    switch (this.input.entityType) {
      case 'RESOURCE':
        return 'li.sending_resource_to_lab';
      case 'SCENARIO':
        return 'li.sending_scenario_to_lab';
      default:
        throw new Error('Unknown entity type');
    }
  }

  private onAutoSendClosed(specs: TdParamSpecs): void {
    if (specs) {
      const action: FlPortalAction = {
        text: this.getSendActionText(),
        action: this.input.autoSend(specs),
        type: LI_SEND_TO_LAB_ACTION,
      };
      this.actionService.addAction(action);
    }
  }

  shareResourceWithSpace(): void {
    const input: LiShareResourceWithSpaceDialogInput = {
      resource: this.input.shareResourceWithSpaceConfig.resource,
    };

    this.dialogService
      .openSmallDialog(LiShareResourceWithSpaceDialogComponent, { data: input })
      .afterClosed()
      .subscribe((shareLink: LiShareLink) => this.onShareWithSpaceClosed(shareLink));
  }

  private onShareWithSpaceClosed(shareLink: LiShareLink): void {
    if (shareLink) {
      this.onSpaceShareLinkUpdate(shareLink);
    }
  }
}
