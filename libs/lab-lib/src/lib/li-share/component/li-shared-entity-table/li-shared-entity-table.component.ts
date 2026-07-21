import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
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
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiSharedEntity, LiSharedEntityDatasource } from '@monorepo/lab-lib/li-core';
import { LiLabInlineComponent } from '@monorepo/lab-lib/li-lab';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-shared-entity-table',
  templateUrl: './li-shared-entity-table.component.html',
  styleUrls: ['./li-shared-entity-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlCoreComponentModule,
    FlUserModule,
    LiLabInlineComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LiSharedEntityTableComponent {
  @Input() datasource: LiSharedEntityDatasource;

  @Input() columns: FlTableColumnStatic<LiSharedEntity>[] = [
    'lab',
    'space',
    'externalId',
    'receiver',
    'sharedBy',
  ];
}
