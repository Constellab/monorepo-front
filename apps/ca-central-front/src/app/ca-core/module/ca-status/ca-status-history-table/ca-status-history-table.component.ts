import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { CaLabStatusHistory, CaLabStatusHistoryDatasource } from '../../../model/entities/lab/ca-lab.class';
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
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-status-history-table',
  templateUrl: './ca-status-history-table.component.html',
  styleUrls: ['./ca-status-history-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    FlStatusModule,
    FlUserModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaStatusHistoryTableComponent {
  @Input({ required: true }) datasource: CaLabStatusHistoryDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaLabStatusHistory>[] = [
    'createdAt',
    'endDate',
    'status',
    'createdBy',
  ];
}
