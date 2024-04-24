import {Component, Input} from '@angular/core';
import {
  CaLabBackupStatusDatasource,
  CaLabBackupStatusDTO
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-lab-backup-status-table',
  templateUrl: './ca-lab-backup-status-table.component.html',
  styleUrl: './ca-lab-backup-status-table.component.scss'
})
export class CaLabBackupStatusTableComponent {

  @Input({required: true}) datasource: CaLabBackupStatusDatasource;

  @Input() columns: FlTableColumnStatic<CaLabBackupStatusDTO>[] = ['frequency', 'region', 'status',
    'lastBackup'];

}
