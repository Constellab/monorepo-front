import { Component, Input } from '@angular/core';
import { CaLabRunningStatus } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
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
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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
