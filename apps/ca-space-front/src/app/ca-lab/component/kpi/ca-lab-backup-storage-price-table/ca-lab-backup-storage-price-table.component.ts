import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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
import { MatTooltip } from '@angular/material/tooltip';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabBackupPeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';

@Component({
  selector: 'ca-lab-backup-storage-price-table',
  templateUrl: './ca-lab-backup-storage-price-table.component.html',
  styleUrl: './ca-lab-backup-storage-price-table.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
    FlCorePipeModule,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabBackupStoragePriceTableComponent {
  @Input() datasource: FlArrayObs<CaLabBackupPeriod>;

  @Input() columns: string[] = ['dates', 'backupSize', 'backupPricePerGBPerHour', 'backupPrice'];
}
