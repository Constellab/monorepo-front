import { Component, Input } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaLabBackupPeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';

@Component({
  selector: 'ca-lab-backup-storage-price-table',
  templateUrl: './ca-lab-backup-storage-price-table.component.html',
  styleUrl: './ca-lab-backup-storage-price-table.component.scss'
})
export class CaLabBackupStoragePriceTableComponent {
  @Input() datasource: FlArrayObs<CaLabBackupPeriod>;

  @Input() columns: string[] = ['dates', 'backupSize', 'backupPricePerGBPerHour', 'backupPrice'];
}
