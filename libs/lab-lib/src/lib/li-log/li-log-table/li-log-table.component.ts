import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import { FlDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { LiLogInfo, LiLogService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiLogCompleteInfoDialogComponent,
  LiLogCompleteInfoDialogInput,
} from '../li-log-complete-info-dialog/li-log-complete-info-dialog.component';

@Component({
  selector: 'li-log-table',
  templateUrl: './li-log-table.component.html',
  styleUrls: ['./li-log-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class LiLogTableComponent {
  private dialogService = inject(FlDialogService);
  private logService = inject(LiLogService);

  @Input({ required: true }) datasource: FlDatasource<LiLogInfo>;

  @Input() columns: string[] = ['name', 'fileSize', 'actions'];

  public openCompleteLog(log: LiLogInfo): void {
    const input: LiLogCompleteInfoDialogInput = {
      logName: log.name,
    };
    this.dialogService.openBigDialog(LiLogCompleteInfoDialogComponent, { data: input });
  }

  public downloadLog(log: LiLogInfo): void {
    const downloadUrl = this.logService.getDownloadUrl(log.name);
    FlFileHelper.downloadUrl(downloadUrl);
  }

  public downloadJsonLog(log: LiLogInfo): void {
    const downloadUrl = this.logService.getDownloadJsonUrl(log.name);
    FlFileHelper.downloadUrl(downloadUrl);
  }
}
