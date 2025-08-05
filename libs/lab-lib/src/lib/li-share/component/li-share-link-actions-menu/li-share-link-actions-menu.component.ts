import { Component, EventEmitter, inject,Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { LiDetailRoutePipe, LiShareLink, LiShareLinkService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiShareLinkFormDialogComponent,
  LiShareLinkFormDialogInput,
} from '../li-share-link-form-dialog/li-share-link-form-dialog.component';

/**
 * Action menu for a share link. To update, delete, copy the link or open entity
 */
@Component({
  selector: 'li-share-link-actions-menu',
  templateUrl: './li-share-link-actions-menu.component.html',
  styleUrls: ['./li-share-link-actions-menu.component.scss'],
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterLink,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LiShareLinkActionsMenuComponent {
  private shareLinkService = inject(LiShareLinkService);
  private dialogService = inject(FlDialogService);

  @Input() shareLink: LiShareLink;

  @Input() showLinkToEntity: boolean = false;

  @Output() update: EventEmitter<LiShareLink> = new EventEmitter();
  @Output() delete: EventEmitter<LiShareLink> = new EventEmitter();

  openUpdateDialog(): void {
    const input: LiShareLinkFormDialogInput = {
      mode: 'update',
      object: this.shareLink,
    };

    this.dialogService
      .openSmallDialog(LiShareLinkFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(entity?: LiShareLink): void {
    if (entity) {
      this.update.emit(entity);
    }
  }

  deleteShareLink(): void {
    const input: FlConfirmDialogInput = {
      title: this.deleteText,
      content:
        this.shareLink.linkType === 'PUBLIC'
          ? 'li.delete_share_link_confirmation'
          : 'li.delete_space_share_link_confirmation',
      observable: this.shareLinkService.delete(this.shareLink.id),
      successMessage: 'li.share_link_deleted',
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
    return this.shareLink.linkType === 'PUBLIC' ? 'li.update_share_link' : 'li.update_space_share_link';
  }

  get deleteText(): string {
    return this.shareLink.linkType === 'PUBLIC' ? 'li.delete_share_link' : 'li.delete_space_share_link';
  }
}
