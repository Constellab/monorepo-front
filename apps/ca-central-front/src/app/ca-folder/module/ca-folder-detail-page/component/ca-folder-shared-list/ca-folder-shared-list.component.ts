import { Component, Inject } from '@angular/core';
import { FlArrayObs, FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import {
  CaGroupShareDialogComponent,
  CaGroupShareDialogInput
} from '../../../../../ca-core/entity-module/ca-group-core/component/ca-group-share-dialog/ca-group-share-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaUser } from '../../../../../ca-core/model/entities/ca-user.class';

export interface CaFolderSharedGroupsListInput {
  folderId: string;
  canEdit: boolean;
  users$: FlArrayObs<CaUser>;
}

/**
 * Component to list the user where the folder is shared with. with button to share or unshare
 */
@Component({
  selector: 'ca-folder-shared-list',
  templateUrl: './ca-folder-shared-list.component.html',
  styleUrls: ['./ca-folder-shared-list.component.scss']
})
export class CaFolderSharedListComponent {

  canEdit: boolean;

  users$: FlArrayObs<CaUser>;

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaFolderSharedGroupsListInput,
              private folderService: CaFolderService,
              private dialogService: FlDialogService) {
    this.canEdit = input.canEdit;
    this.users$ = input.users$;
  }


  openShareDialog(): void {
    const input: CaGroupShareDialogInput = {
      share: group => this.folderService.shareFolder(this.input.folderId, group.id)
    };

    this.dialogService.openSmallDialog(CaGroupShareDialogComponent, { data: input }).afterClosed().subscribe(
      group => this.onShareDialogClosed(group)
    );
  }

  openUnshareDialog(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unshare',
      content: 'unshare_confirmation',
      observable: this.folderService.unshareFolder(this.input.folderId, user.id),
      successMessage: 'unshared'
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onRemoveSharingClosed(result, user)
    );
  }

  private onShareDialogClosed(users: CaUser[]): void {
    if (users) {
      this.users$.array = users;
    }
  }

  private onRemoveSharingClosed(result: FlConfirmDialogResult, user: CaUser): void {
    if (result.choice) {
      this.users$.removeItem(user);
    }
  }

}
