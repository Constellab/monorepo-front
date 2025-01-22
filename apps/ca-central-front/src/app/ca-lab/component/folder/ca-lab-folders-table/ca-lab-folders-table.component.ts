import { Component, Input, inject } from '@angular/core';
import {
  CaLabFolder,
  CaLabFolderDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-folder.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaLabFolderService } from '../../../../ca-core/service-api/ca-lab-folder.service';

@Component({
  selector: 'ca-lab-folders-table',
  templateUrl: './ca-lab-folders-table.component.html',
  styleUrls: ['./ca-lab-folders-table.component.scss'],
  standalone: false,
})
export class CaLabFoldersTableComponent {
  private labFolderService = inject(CaLabFolderService);
  private dialogService = inject(FlDialogService);
  private snackbarService = inject(FlSnackBarService);

  @Input({ required: true }) datasource: CaLabFolderDatasource;

  @Input({ required: true }) labId: string;

  @Input() columns: FlTableColumnStatic<CaLabFolder>[] = ['folder', 'createdBy', 'createdAt'];

  syncLabFolder(labFolder: CaLabFolder): void {
    this.labFolderService
      .syncLabFolder(this.labId, labFolder.rootFolder.id)
      .subscribe(() =>
        this.snackbarService.openSuccessMessage({ text: 'lab_folder_synced', translateText: true })
      );
  }

  openDeleteFolderDialog(labFolder: CaLabFolder): void {
    const data: FlConfirmDialogInput = {
      title: 'lab_remove_folder',
      content: 'lab_remove_folder_confirmation',
      observable: this.labFolderService.removeFolderFromLab(this.labId, labFolder.rootFolder.id),
      successMessage: 'lab_folder_removed',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<void>) => this.onDeleteUserClosed(result, labFolder));
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult<void>, labFolder: CaLabFolder): void {
    if (result.choice) {
      this.datasource.removeItem(labFolder);
    }
  }
}
