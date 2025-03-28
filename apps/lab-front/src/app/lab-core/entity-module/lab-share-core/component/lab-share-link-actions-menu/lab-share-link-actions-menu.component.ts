import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LabShareLink } from '../../../../model/entities/lab-share.entity';
import { LabShareLinkService } from '../../../../entity-service/lab-share-link.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  LabShareLinkFormDialogComponent,
  LabShareLinkFormDialogInput,
} from '../lab-share-link-form-dialog/lab-share-link-form-dialog.component';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

/**
 * Action menu for a share link. To update, delete, copy the link or open entity
 */
@Component({
  selector: 'lab-share-link-actions-menu',
  templateUrl: './lab-share-link-actions-menu.component.html',
  styleUrls: ['./lab-share-link-actions-menu.component.scss'],
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterLink,
    TranslatePipe,
    LabDetailRoutePipe,
  ],
})
export class LabShareLinkActionsMenuComponent {
  private shareLinkService = inject(LabShareLinkService);
  private dialogService = inject(FlDialogService);

  @Input() shareLink: LabShareLink;

  @Input() showLinkToEntity: boolean = false;

  @Output() update: EventEmitter<LabShareLink> = new EventEmitter();
  @Output() delete: EventEmitter<LabShareLink> = new EventEmitter();

  openUpdateDialog(): void {
    const input: LabShareLinkFormDialogInput = {
      mode: 'update',
      object: this.shareLink,
    };

    this.dialogService
      .openSmallDialog(LabShareLinkFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(entity?: LabShareLink): void {
    if (entity) {
      this.update.emit(entity);
    }
  }

  deleteShareLink(): void {
    const input: FlConfirmDialogInput = {
      title: this.deleteText,
      content:
        this.shareLink.linkType === 'PUBLIC'
          ? 'biox.delete_share_link_confirmation'
          : 'biox.delete_space_share_link_confirmation',
      observable: this.shareLinkService.delete(this.shareLink.id),
      successMessage: 'biox.share_link_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.delete.emit(this.shareLink);
    }
  }

  get updateText(): string {
    return this.shareLink.linkType === 'PUBLIC' ? 'biox.update_share_link' : 'biox.update_space_share_link';
  }

  get deleteText(): string{
    return this.shareLink.linkType === 'PUBLIC' ? 'biox.delete_share_link' : 'biox.delete_space_share_link';
  }
}
