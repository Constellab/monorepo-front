import { Component, Input } from '@angular/core';
import {
  CaLabBackupHistory,
  CaLabBackupHistoryDatasource,
} from '../../../../model/entities/lab/ca-lab-backup.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { ClDateHelper } from '@monorepo/core-lib';

@Component({
    selector: 'ca-lab-backup-history-table',
    templateUrl: './ca-lab-backup-history-table.component.html',
    styleUrls: ['./ca-lab-backup-history-table.component.scss'],
    standalone: false
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
