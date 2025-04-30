import { Component, Input } from '@angular/core';
import { CaActivity, CaActivityDatasource } from '../../../../model/entities/ca-activity.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-activity-table',
  templateUrl: './ca-activity-table.component.html',
  styleUrls: ['./ca-activity-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    FlUserModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaActivityTableComponent {
  @Input({ required: true }) datasource: CaActivityDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaActivity>[] = ['title', 'entityType', 'entityName', 'creation'];
}
