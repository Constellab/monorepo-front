import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';

/**
 * Dialog to show information about the lab backup statuses
 * It is for admin as it shows more information than the user version
 */
@Component({
  selector: 'ca-lab-backups-statuses-admin',
  templateUrl: './ca-lab-backups-statuses-admin.component.html',
  styleUrl: './ca-lab-backups-statuses-admin.component.scss'
})
export class CaLabBackupsStatusesAdminComponent {

  labInstanceId: string = inject(MAT_DIALOG_DATA);

  backupsStatuses: CaLabBackupStatusDatasource =
    new CaLabBackupStatusDatasource(this.labService.getBackupsStatusAdmin(this.labInstanceId));

  columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = ['frequency', 'region', 'status',
    'lastBackup', 'bucketInfo'];

  constructor(private labService: CaLabInstanceService) {
  }

}
