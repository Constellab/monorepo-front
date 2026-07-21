import { ChangeDetectionStrategy,Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaFolderUser, CaFolderUserArrayObs } from '../../../../model/entities/folder/ca-folder-user.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import {
  CaFolderUserUpdateRoleDialogComponent,
  CaFolderUserUpdateRoleDialogInput,
} from '../ca-folder-user-update-role-dialog/ca-folder-user-update-role-dialog.component';

@Component({
  selector: 'ca-folder-user-table',
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    TranslatePipe,
    FlUserModule,
    MatTooltip,
    MatButtonModule,
  ],
  templateUrl: './ca-folder-user-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-folder-user-table.component.scss',
})
export class CaFolderUserTableComponent {
  datasource = input.required<CaFolderUserArrayObs>();

  folderId = input.required<string>();

  columns = input<FlTableColumnStatic<CaFolderUser>[]>(['user', 'role', 'sharedInfo', 'actions']);

  private folderService = inject(CaFolderService);
  private dialogService = inject(FlDialogService);

  openUpdateRoleDialog(folderUser: CaFolderUser): void {
    const input: CaFolderUserUpdateRoleDialogInput = {
      folderId: this.folderId(),
      user: folderUser.user,
      role: folderUser.role,
    };

    this.dialogService
      .openSmallDialog(CaFolderUserUpdateRoleDialogComponent, { data: input })
      .afterClosed()
      .subscribe((folderUser) => this.onUpdateRoleDialogClosed(folderUser));
  }

  private onUpdateRoleDialogClosed(folderUser: CaFolderUser): void {
    if (folderUser) {
      this.datasource().updateItem(folderUser);
    }
  }

  openUnshareDialog(folderUser: CaFolderUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unshare',
      content: 'unshare_confirmation',
      observable: this.folderService.unshareFolder(this.folderId(), folderUser.user.id),
      successMessage: 'unshared',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onRemoveSharingClosed(result, folderUser));
  }

  private onRemoveSharingClosed(result: FlConfirmDialogResult, folderUser: CaFolderUser): void {
    if (result.choice) {
      this.datasource().removeItem(folderUser);
    }
  }
}
