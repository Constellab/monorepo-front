import { Component, inject, Input } from '@angular/core';
import { FlDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { LabLogInfo } from '../../../model/entities/lab-log.entity';
import {
  LabLogCompleteInfoDialogComponent,
  LabLogCompleteInfoDialogInput,
} from '../lab-log-complete-info-dialog/lab-log-complete-info-dialog.component';
import { LabLogService } from '../../../entity-service/lab-log.service';
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
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-log-table',
  templateUrl: './lab-log-table.component.html',
  styleUrls: ['./lab-log-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabLogTableComponent {
  private dialogService = inject(FlDialogService);
  private logService = inject(LabLogService);

  @Input({ required: true }) datasource: FlDatasource<LabLogInfo>;

  @Input() columns: string[] = ['name', 'fileSize', 'actions'];

  public openCompleteLog(log: LabLogInfo): void {
    const input: LabLogCompleteInfoDialogInput = {
      logName: log.name,
    };
    this.dialogService.openBigDialog(LabLogCompleteInfoDialogComponent, { data: input });
  }

  public downloadLog(log: LabLogInfo): void {
    const downloadUrl = this.logService.getDownloadUrl(log.name);
    FlFileHelper.downloadUrl(downloadUrl);
  }

  public downloadJsonLog(log: LabLogInfo): void {
    const downloadUrl = this.logService.getDownloadJsonUrl(log.name);
    FlFileHelper.downloadUrl(downloadUrl);
  }
}
