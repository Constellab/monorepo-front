import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
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
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaAdminPanelTableAction } from '../../model/ha-admin-panel-table-action.class';

export interface HaAdminPanelBricksTableActionEvent {
  type: string;
  brick: HaBrick;
}

@Component({
  selector: 'ha-admin-panel-bricks-table',
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    TranslatePipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlUserModule,
    CoCommunityLibModule,
  ],
  templateUrl: './ha-admin-panel-bricks-table.component.html',
  styleUrl: './ha-admin-panel-bricks-table.component.scss',
})
export class HaAdminPanelBricksTableComponent {
  datasource = input.required<FlDatasource<HaBrick>>();

  columns = input<FlTableColumnStatic<HaBrick>[]>(['name', 'space', 'created', 'lastModified', 'actions']);

  action = output<HaAdminPanelBricksTableActionEvent>();

  haAdminPanelBricksTableActions: HaAdminPanelTableAction[] = [
    {
      type: 'download_docs',
      icon: 'cloud_download',
      tooltip: 'download_brick_docs_zip_file',
    },
  ];

  onAction(action: HaAdminPanelTableAction, brick: HaBrick): void {
    this.action.emit({
      brick: brick,
      type: action.type,
    });
  }
}
