import {Component, Inject, OnInit} from '@angular/core';
import {LabSharedEntityDatasource, LabShareLink, LabShareLinkType} from '../../../../model/entities/lab-share.entity';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  LabShareLinkFormDialogComponent,
  LabShareLinkFormDialogInput
} from '../lab-share-link-form-dialog/lab-share-link-form-dialog.component';
import {FlClipboardService, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {Observable, of, share} from 'rxjs';
import {LabShareService} from '../../../../entity-service/lab-share.service';
import {LabShareLinkService} from '../../../../entity-service/lab-share-link.service';

export interface LabSharedEntityInfoDialogInput {
  entityType: LabShareLinkType;
  entityId: string;
}

@Component({
  selector: 'lab-shared-entity-info-dialog',
  templateUrl: './lab-shared-entity-info-dialog.component.html',
  styleUrls: ['./lab-shared-entity-info-dialog.component.scss'],
})
export class LabSharedEntityInfoDialogComponent implements OnInit {

  entityType: LabShareLinkType;
  entityId: string;

  shareLink$: Observable<LabShareLink>;

  sharedEntities: LabSharedEntityDatasource;

  constructor(@Inject(MAT_DIALOG_DATA) input: LabSharedEntityInfoDialogInput,
              private shareService: LabShareService,
              private shareLinkService: LabShareLinkService,
              private dialogService: FlDialogService,
              private clipboardService: FlClipboardService,
              private snackBarService: FlSnackBarService) {
    this.entityType = input.entityType;
    this.entityId = input.entityId;
  }

  ngOnInit(): void {
    this.shareLink$ = this.shareLink$ = this.shareLinkService.getShareLink(this.entityType, this.entityId).pipe(share());
    this.sharedEntities = this.shareService.getSharedToDatasource(this.entityType, this.entityId);
  }


  openShareDialog(): void {
    const data: LabShareLinkFormDialogInput = {
      mode: 'create',
      entityType: this.entityType,
      entityId: this.entityId,
      createTitle: this.getShareDialogTitle()
    };

    this.dialogService.openSmallDialog(LabShareLinkFormDialogComponent, {data: data}).afterClosed().subscribe(
      (shareLink: LabShareLink) => this.onShareClosedClosed(shareLink)
    );
  }

  private onShareClosedClosed(shareLink?: LabShareLink): void {
    if (shareLink) {
      this.onShareLinkUpdate(shareLink);
    }
  }

  private getShareDialogTitle(): string {
    switch (this.entityType) {
      case 'RESOURCE':
        return 'biox.share_resource';
      default:
        throw new Error('Unknown entity type');
    }
  }

  get shareButtonText(): string {
    switch (this.entityType) {
      case 'RESOURCE':
        return 'biox.share_resource';
      default:
        throw new Error('Unknown entity type');
    }
  }

  onShareLinkUpdate(entity: LabShareLink): void {
    this.shareLink$ = of(entity);
  }

  onShareLinkDelete(): void {
    this.shareLink$ = of(null);
  }

  getDownloadLink(shareLink: LabShareLink): string {
    if (shareLink) {
      return this.shareLinkService.getDownloadLink(shareLink.entityType, shareLink.token);
    }
    return null;
  }

  copyDownloadLink(shareLink: LabShareLink): void {
    const result = this.clipboardService.copy(this.shareService.getDownloadRoute(shareLink.entityType, shareLink.token));
    if (result) {
      this.snackBarService.openSuccessMessage({text: 'biox.share_link_copied', translateText: true});
    }
  }
}
