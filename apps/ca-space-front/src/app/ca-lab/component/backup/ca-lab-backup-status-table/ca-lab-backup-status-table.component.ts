import { Component, inject, Input } from '@angular/core';
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
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';

import { CaCloudProviderRegionInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import {
  CaLabRestoreBackupToLabComponent,
  CaLabRestoreBackupToLabDialogInput,
} from '../ca-lab-restore-backup-to-lab/ca-lab-restore-backup-to-lab.component';

@Component({
  selector: 'ca-lab-backup-status-table',
  templateUrl: './ca-lab-backup-status-table.component.html',
  styleUrl: './ca-lab-backup-status-table.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaCloudProviderRegionInlineComponent,
    FlStatusModule,
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
    FlDateModule,
  ],
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
