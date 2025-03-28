import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiSharedEntity, LiSharedEntityDatasource } from '@monorepo/lab-lib/li-core';
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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-shared-entity-table',
  templateUrl: './li-shared-entity-table.component.html',
  styleUrls: ['./li-shared-entity-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
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
export class LiSharedEntityTableComponent {
  @Input() datasource: LiSharedEntityDatasource;

  @Input() columns: FlTableColumnStatic<LiSharedEntity>[] = ['lab', 'space', 'receiver', 'sharedBy'];
}
