import {Component, Input, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaLabBackupsStatusesAdminComponent
} from '../ca-lab-backups-statuses-admin/ca-lab-backups-statuses-admin.component';
import {CaAuthenticatedUserService} from '../../../../ca-core/service-api/ca-authenticated-user.service';

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

  columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = ['frequency', 'region', 'status', 'lastBackup'];

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private authenticateService: CaAuthenticatedUserService) {
  }

  ngOnInit(): void {
    this.loadBackupStatuses();
    if (this.authenticateService.isAdmin()) {
      this.columns.push('actions');
    }
  }

  private loadBackupStatuses(): void {
    this.backupsStatuses = new CaLabBackupStatusDatasource(this.labService.getBackupsStatus(this.labInstanceId));
  }

  openLabBackupStatusesAdmin(): void {
    this.dialogService.openMediumDialog(CaLabBackupsStatusesAdminComponent, {data: this.labInstanceId});
  }

  deleteLabBackups(): void {
    const data: FlConfirmDialogInput = {
      title: 'lab_delete_backup',
      content: 'lab_delete_backup_confirmation',
      observable: this.labService.deleteLabBackups(this.labInstanceId),
      successMessage: 'lab_backup_deleted',
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(result => this.onDeleteBackupClosed(result));
  }

  private onDeleteBackupClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.loadBackupStatuses();
    }
  }
}
