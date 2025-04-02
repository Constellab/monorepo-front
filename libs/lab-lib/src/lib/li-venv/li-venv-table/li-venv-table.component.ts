import { Component, Input, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LiVenvArrayObs, LiVenvBasicInfo, LiVenvService } from '@monorepo/lab-lib/li-core';
import {
  LiVenvDetailDialogComponent,
  LiVenvDetailDialogInput,
} from '../li-venv-detail-dialog/li-venv-detail-dialog.component';
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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-venv-table',
  templateUrl: './li-venv-table.component.html',
  styleUrls: ['./li-venv-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlDateModule,
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
  ],
})
export class LiVenvTableComponent {
  private dialogService = inject(FlDialogService);
  private venvService = inject(LiVenvService);

  @Input() datasource: LiVenvArrayObs;

  @Input() columns: FlTableColumnStatic<LiVenvBasicInfo>[] = [
    'name',
    'type',
    'configFileOrigin',
    'createdAt',
    'actions',
  ];

  openVenvDetailDialog(venv: LiVenvBasicInfo): void {
    const input: LiVenvDetailDialogInput = {
      venvName: venv.name,
    };

    this.dialogService.openMediumDialog(LiVenvDetailDialogComponent, { data: input });
  }

  openDeleteVenvDialog(venv: LiVenvBasicInfo): void {
    const data: FlConfirmDialogInput = {
      title: 'li.delete_venv',
      content: 'li.delete_venv_confirmation',
      observable: this.venvService.deleteVenv(venv.name),
      successMessage: 'li.delete_venv_success',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, venv));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, venv: LiVenvBasicInfo): void {
    if (result.choice) {
      this.datasource.removeItem(venv);
    }
  }
}
