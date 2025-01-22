import { Component, Input, inject } from '@angular/core';
import { FlDatasource, FlDialogService, FlFileHelper } from '@monorepo/front-core-lib';
import { LabLogInfo } from '../../../model/entities/lab-log.entity';
import {
  LabLogCompleteInfoDialogComponent,
  LabLogCompleteInfoDialogInput,
} from '../lab-log-complete-info-dialog/lab-log-complete-info-dialog.component';
import { LabLogService } from '../../../entity-service/lab-log.service';

@Component({
  selector: 'lab-log-table',
  templateUrl: './lab-log-table.component.html',
  styleUrls: ['./lab-log-table.component.scss'],
  standalone: false,
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
