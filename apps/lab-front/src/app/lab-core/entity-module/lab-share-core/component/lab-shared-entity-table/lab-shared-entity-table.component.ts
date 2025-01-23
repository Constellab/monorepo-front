import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabSharedEntity, LabSharedEntityDatasource } from '../../../../model/entities/lab-share.entity';
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
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-shared-entity-table',
  templateUrl: './lab-shared-entity-table.component.html',
  styleUrls: ['./lab-shared-entity-table.component.scss'],
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
export class LabSharedEntityTableComponent {
  @Input() datasource: LabSharedEntityDatasource;

  @Input() columns: FlTableColumnStatic<LabSharedEntity>[] = ['lab', 'space', 'receiver', 'sharedBy'];
}
