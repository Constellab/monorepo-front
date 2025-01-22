import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { CaLabBackupStatusTableComponent } from '../ca-lab-backup-status-table/ca-lab-backup-status-table.component';
import { TranslatePipe } from '@ngx-translate/core';

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
    CdkScrollable,
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
