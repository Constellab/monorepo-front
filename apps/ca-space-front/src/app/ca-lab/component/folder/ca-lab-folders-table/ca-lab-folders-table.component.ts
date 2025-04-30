import { Component, inject, Input } from '@angular/core';
import {
  CaLabFolder,
  CaLabFolderDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-folder.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaLabFolderService } from '../../../../ca-core/service-api/ca-lab-folder.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CaHierarchyObjectInlineComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-inline/ca-hierarchy-object-inline.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-lab-folders-table',
  templateUrl: './ca-lab-folders-table.component.html',
  styleUrls: ['./ca-lab-folders-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaHierarchyObjectInlineComponent,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
  ],
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
