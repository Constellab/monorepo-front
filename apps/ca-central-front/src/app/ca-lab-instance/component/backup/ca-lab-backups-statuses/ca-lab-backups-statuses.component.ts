import {Component, Input, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {CaLabBackupStatusDatasource} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {
  CaLabBackupsStatusesAdminComponent
} from '../ca-lab-backups-statuses-admin/ca-lab-backups-statuses-admin.component';

/**
 * Statuses of all lab backups
 */
@Component({
  selector: 'ca-lab-backups-statuses',
  templateUrl: './ca-lab-backups-statuses.component.html',
  styleUrls: ['./ca-lab-backups-statuses.component.scss'],
})
export class CaLabBackupsStatusesComponent implements OnInit {

  @Input() labInstanceId: string;

  backupsStatuses: CaLabBackupStatusDatasource;

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.loadBackupStatuses();
  }

  private loadBackupStatuses(): void {
    this.backupsStatuses = new CaLabBackupStatusDatasource(this.labService.getBackupsStatus(this.labInstanceId));
  }

  openLabBackupStatusesAdmin(): void {
    this.dialogService.openMediumDialog(CaLabBackupsStatusesAdminComponent, {data: this.labInstanceId});
  }

  deleteLabBackups(): void {
    const data: FlConfirmDialogInput= {
      title: 'lab_delete_backup',
      content: 'lab_delete_backup_confirmation',
      translateTitleAndContent: true,
      observable: this.labService.deleteLabBackups(this.labInstanceId),
      successMessage: 'lab_backup_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(result => this.onDeleteBackupClosed(result));
  }

  private onDeleteBackupClosed(result: FlConfirmDialogResult): void{
    if(result.choice){
      this.loadBackupStatuses();
    }
  }
}
