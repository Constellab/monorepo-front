import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
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
import { ClDateHelper } from '@monorepo/core-lib';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabBackupHistory,
  CaLabBackupHistoryDatasource,
} from '../../../../model/entities/lab/ca-lab-backup.class';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaLabBackupHistoryDetailComponent } from '../ca-lab-backup-history-detail/ca-lab-backup-history-detail.component';

@Component({
  selector: 'ca-lab-backup-history-table',
  templateUrl: './ca-lab-backup-history-table.component.html',
  styleUrls: ['./ca-lab-backup-history-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlStatusModule,
    CaCloudProviderRegionInlineComponent,
    CaLabBackupHistoryDetailComponent,
    FlKeyValueModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabBackupHistoryTableComponent {
  @Input({ required: true }) datasource: CaLabBackupHistoryDatasource;

  @Input() columns: FlTableColumnStatic<CaLabBackupHistory>[] = ['date', 'region', 'data', 'db', 'info'];

  currentDate = ClDateHelper.getDate();

  getDuration(backup: CaLabBackupHistory): number {
    const endedAt = backup.endedAt ?? this.currentDate;
    return endedAt.diff(backup.startedAt, 'seconds').seconds * 1000;
  }
}
