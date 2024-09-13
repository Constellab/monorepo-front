import {Component, Inject} from '@angular/core';
import {FlArrayObs, FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {
  CaGroupShareDialogComponent,
  CaGroupShareDialogInput
} from '../../../../../ca-core/entity-module/ca-group-core/component/ca-group-share-dialog/ca-group-share-dialog.component';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CaUser} from '../../../../../ca-core/model/entities/ca-user.class';
import {CaFolderDetailState} from '../../state/ca-folder-detail.state';

export interface CaFolderSharedGroupsListInput {
  folderId: string;
  canEdit$: Observable<boolean>;
}

/**
 * Component to list the user where the folder is shared with. with button to share or unshare
 */
@Component({
  selector: 'ca-folder-shared-list',
  templateUrl: './ca-folder-shared-list.component.html',
  styleUrls: ['./ca-folder-shared-list.component.scss'],
})
export class CaFolderSharedListComponent {

  canEdit$: Observable<boolean>;

  users$: FlArrayObs = this.state.getUsers();

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaFolderSharedGroupsListInput,
              private state: CaFolderDetailState,
              private folderService: CaFolderService,
              private dialogService: FlDialogService) {
    this.canEdit$ = input.canEdit$;
  }


  openShareDialog(): void {
    const input: CaGroupShareDialogInput = {
      share: group => this.folderService.shareFolder(this.input.folderId, group.id)
    };

    this.dialogService.openSmallDialog(CaGroupShareDialogComponent, {data: input}).afterClosed().subscribe(
      group => this.onShareDialogClosed(group)
    );
  }

  private onShareDialogClosed(users: CaUser[]): void {
    if (users) {
      this.users$.array = users;
    }
  }

  openUnshareDialog(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unshare',
      content: 'unshare_confirmation',
      translateTitleAndContent: true,
      observable: this.folderService.unshareFolder(this.input.folderId, user.id),
      successMessage: 'unshared',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onRemoveSharingClosed(result, user)
    );
  }

  private onRemoveSharingClosed(result: FlConfirmDialogResult, user: CaUser): void {
    if (result.choice) {
      this.users$.removeItem(user);
    }
  }

}
