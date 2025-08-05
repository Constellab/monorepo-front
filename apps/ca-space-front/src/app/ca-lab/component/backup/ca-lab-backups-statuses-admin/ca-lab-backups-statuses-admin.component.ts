import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabBackupStatusTableComponent,
} from '../ca-lab-backup-status-table/ca-lab-backup-status-table.component';

/**
 * Dialog to show information about the lab backup statuses
 * It is for admin as it shows more information than the user version
 */
@Component({
  selector: 'ca-lab-backups-statuses-admin',
  templateUrl: './ca-lab-backups-statuses-admin.component.html',
  styleUrl: './ca-lab-backups-statuses-admin.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    CaLabBackupStatusTableComponent,
    TranslatePipe,
  ],
})
export class CaLabBackupsStatusesAdminComponent {
  private labService = inject(CaLabService);

  labId: string = inject(MAT_DIALOG_DATA);

  backupsStatuses: CaLabBackupStatusDatasource = new CaLabBackupStatusDatasource(
    this.labService.getBackupsStatusAdmin(this.labId)
  );

  columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = [
    'frequency',
    'region',
    'status',
    'lastBackup',
    'bucketInfo',
    'actions',
  ];
}
