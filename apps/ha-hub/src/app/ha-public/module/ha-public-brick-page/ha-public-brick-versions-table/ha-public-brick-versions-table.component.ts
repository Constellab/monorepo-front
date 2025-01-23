import { Component, Input, inject } from '@angular/core';
import { FlDatasource, FlDialogService, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { HaBrickVersion } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaPublicBrickVersionDetailDialogComponent } from '../ha-public-brick-version-detail-dialog/ha-public-brick-version-detail-dialog.component';
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
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-public-brick-versions-table',
  templateUrl: './ha-public-brick-versions-table.component.html',
  styleUrls: ['./ha-public-brick-versions-table.component.scss'],
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
export class HaPublicBrickVersionsTableComponent {
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: FlDatasource<HaBrickVersion>;

  @Input() columns: FlTableColumnStatic<HaBrickVersion>[] = [
    'version',
    'repoType',
    'lastModified',
    'informations',
  ];

  openBrickVersionDetail(bv: HaBrickVersion): void {
    this.dialogService.openMediumDialog(HaPublicBrickVersionDetailDialogComponent, { data: bv });
  }
}
