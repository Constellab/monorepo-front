import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
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
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaBrickVersion } from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaBrickVersionDetailDialogComponent } from '../ha-brick-version-detail-dialog/ha-brick-version-detail-dialog.component';

@Component({
  selector: 'ha-brick-versions-table',
  templateUrl: './ha-brick-versions-table.component.html',
  styleUrls: ['./ha-brick-versions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlUserModule,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class HaBrickVersionsTableComponent {
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: FlDatasource<HaBrickVersion>;

  @Input() columns: FlTableColumnStatic<HaBrickVersion>[] = [
    'version',
    'repoType',
    'lastModified',
    'informations',
  ];

  openBrickVersionDetail(bv: HaBrickVersion): void {
    this.dialogService.openMediumDialog(HaBrickVersionDetailDialogComponent, { data: bv });
  }
}
