import { Component, Input } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaLabBackupPeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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
