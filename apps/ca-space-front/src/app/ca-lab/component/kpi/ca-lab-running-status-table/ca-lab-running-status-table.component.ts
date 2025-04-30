import { Component, Input } from '@angular/core';
import { CaLabRunningStatus } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-lab-running-status-table',
  templateUrl: './ca-lab-running-status-table.component.html',
  styleUrls: ['./ca-lab-running-status-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlKeyValueModule,
    FlUserModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabRunningStatusTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaLabRunningStatus>;

  @Input() columns: FlTableColumnStatic<CaLabRunningStatus>[] = [
    'fromDate',
    'toDate',
    'duration',
    'price',
    'user',
  ];
}
