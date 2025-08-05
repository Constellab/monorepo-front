import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {
  CaIsAdminDirective
} from '../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabBackupStatusTableComponent,
} from '../ca-lab-backup-status-table/ca-lab-backup-status-table.component';
import {
  CaLabBackupsStatusesAdminComponent,
} from '../ca-lab-backups-statuses-admin/ca-lab-backups-statuses-admin.component';

/**
 * Statuses of all lab backups
 */
@Component({
  selector: 'ca-lab-backups-statuses',
  templateUrl: './ca-lab-backups-statuses.component.html',
  styleUrls: ['./ca-lab-backups-statuses.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    CaIsAdminDirective,
    MatButton,
    FlSectionModule,
    CaLabBackupStatusTableComponent,
    TranslatePipe,
  ],
})
export class CaLabBackupsStatusesComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private authenticateService = inject(CaAuthenticatedUserService);

  @Input() labId: string;

  backupsStatuses: CaLabBackupStatusDatasource;

  columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = ['frequency', 'region', 'status', 'lastBackup'];

  ngOnInit(): void {
    this.loadBackupStatuses();
    if (this.authenticateService.isAdmin()) {
      this.columns.push('actions');
    }
  }

  private loadBackupStatuses(): void {
    this.backupsStatuses = new CaLabBackupStatusDatasource(this.labService.getBackupsStatus(this.labId));
  }

  openLabBackupStatusesAdmin(): void {
    this.dialogService.openMediumDialog(CaLabBackupsStatusesAdminComponent, { data: this.labId });
  }

  deleteLabBackups(): void {
    const data: FlConfirmDialogInput = {
      title: 'lab_delete_backup',
      content: 'lab_delete_backup_confirmation',
      observable: this.labService.deleteLabBackups(this.labId),
      successMessage: 'lab_backup_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteBackupClosed(result));
  }

  private onDeleteBackupClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.loadBackupStatuses();
    }
  }
}
