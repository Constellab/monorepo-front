import { Component, Input, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { LabVenvArrayObs, LabVenvBasicInfo } from '../../../model/entities/lab-venv.entity';
import {
  LabVenvDetailDialogComponent,
  LabVenvDetailDialogInput,
} from '../lab-venv-detail-dialog/lab-venv-detail-dialog.component';
import { LabVenvService } from '../../../entity-service/lab-venv.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-venv-table',
  templateUrl: './lab-venv-table.component.html',
  styleUrls: ['./lab-venv-table.component.scss'],
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
export class LabVenvTableComponent {
  private dialogService = inject(FlDialogService);
  private venvService = inject(LabVenvService);

  @Input() datasource: LabVenvArrayObs;

  @Input() columns: FlTableColumnStatic<LabVenvBasicInfo>[] = [
    'name',
    'type',
    'configFileOrigin',
    'createdAt',
    'actions',
  ];

  openVenvDetailDialog(venv: LabVenvBasicInfo): void {
    const input: LabVenvDetailDialogInput = {
      venvName: venv.name,
    };

    this.dialogService.openMediumDialog(LabVenvDetailDialogComponent, { data: input });
  }

  openDeleteVenvDialog(venv: LabVenvBasicInfo): void {
    const data: FlConfirmDialogInput = {
      title: 'monitoring.delete_venv',
      content: 'monitoring.delete_venv_confirmation',
      observable: this.venvService.deleteVenv(venv.name),
      successMessage: 'monitoring.delete_venv_success',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, venv));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, venv: LabVenvBasicInfo): void {
    if (result.choice) {
      this.datasource.removeItem(venv);
    }
  }
}
