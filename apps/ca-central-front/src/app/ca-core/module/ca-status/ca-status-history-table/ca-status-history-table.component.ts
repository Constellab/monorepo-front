import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaLabStatusHistory, CaLabStatusHistoryDatasource } from '../../../model/entities/lab/ca-lab.class';
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
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlStatusModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'ca-status-history-table',
  templateUrl: './ca-status-history-table.component.html',
  styleUrls: ['./ca-status-history-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
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
