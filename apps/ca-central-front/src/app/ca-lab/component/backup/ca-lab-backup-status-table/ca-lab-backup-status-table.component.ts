import { Component, Input, inject } from '@angular/core';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { FlDialogService, FlTableColumnStatic } from '@monorepo/front-core-lib';
import {
  CaLabRestoreBackupToLabComponent,
  CaLabRestoreBackupToLabDialogInput,
} from '../ca-lab-restore-backup-to-lab/ca-lab-restore-backup-to-lab.component';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

@Component({
  selector: 'ca-lab-backup-status-table',
  templateUrl: './ca-lab-backup-status-table.component.html',
  styleUrl: './ca-lab-backup-status-table.component.scss',
  standalone: false,
})
export class CaLabBackupStatusTableComponent {
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  @Input({ required: true }) datasource: CaLabBackupStatusDatasource;

  @Input({ required: true }) labId: string;

  @Input() columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = [
    'frequency',
    'region',
    'status',
    'lastBackup',
  ];

  restoreBackupToLab(backupStatus: CaLabBackupStatusDTO): void {
    const data: CaLabRestoreBackupToLabDialogInput = {
      backupStatus: backupStatus,
      labId: this.labId,
    };
    this.dialogService
      .openMediumDialog(CaLabRestoreBackupToLabComponent, { data: data })
      .afterClosed()
      .subscribe((destinationLab) => this.onRestoreClose(destinationLab));
  }

  private onRestoreClose(destinationLab?: CaLab): void {
    if (destinationLab) {
      this.routerService.navigateToLabConfigRoute(destinationLab.id);
    }
  }
}
