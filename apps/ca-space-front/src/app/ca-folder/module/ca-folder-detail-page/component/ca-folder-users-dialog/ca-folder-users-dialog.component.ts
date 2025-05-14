import { Component, inject } from '@angular/core';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CaFolderShareDialogComponent,
  CaFolderShareDialogInput,
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-share-dialog/ca-folder-share-dialog.component';
import {
  CaFolderUser,
  CaFolderUserArrayObs,
} from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaFolderUserTableComponent } from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-user-table/ca-folder-user-table.component';

export interface CaFolderUsersDialogInput {
  folderId: string;
}

/**
 * Component to list the user where the folder is shared with. with button to share or unshare
 */
@Component({
  selector: 'ca-folder-users-dialog',
  templateUrl: './ca-folder-users-dialog.component.html',
  styleUrls: ['./ca-folder-users-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    FlUserModule,
    MatIcon,
    MatButton,
    TranslatePipe,
    CaFolderUserTableComponent,
  ],
})
export class CaFolderUsersDialogComponent {
  dialogInput: CaFolderUsersDialogInput = inject(MAT_DIALOG_DATA);

  private folderService = inject(CaFolderService);
  private dialogService = inject(FlDialogService);

  folderUsers$ = new CaFolderUserArrayObs(
    this.folderService.getFolderUsersWithRole(this.dialogInput.folderId)
  );

  openShareDialog(): void {
    const input: CaFolderShareDialogInput = {
      rootFolderId: this.dialogInput.folderId,
    };

    this.dialogService
      .openSmallDialog(CaFolderShareDialogComponent, { data: input })
      .afterClosed()
      .subscribe((group) => this.onShareDialogClosed(group));
  }

  private onShareDialogClosed(folderUsers: CaFolderUser[]): void {
    if (folderUsers) {
      this.folderUsers$.setData(folderUsers);
    }
  }
}
