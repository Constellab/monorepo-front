import { Component, Input } from '@angular/core';
import { CaActivity, CaActivityDatasource } from '../../../../model/entities/ca-activity.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
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
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-activity-table',
  templateUrl: './ca-activity-table.component.html',
  styleUrls: ['./ca-activity-table.component.scss'],
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
