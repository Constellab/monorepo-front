import { Component, input, output } from '@angular/core';
import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { MatSortHeader } from '@angular/material/sort';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { CoCommunityLibModule } from '@monorepo/community-lib';

export interface HaAdminPanelBricksTableAction {
  type: string;
  icon: string;
  tooltip: string;
}

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

  haAdminPanelBricksTableActions: HaAdminPanelBricksTableAction[] = [
    {
      type: 'download_docs',
      icon: 'cloud_download',
      tooltip: 'download_brick_docs_zip_file',
    },
    {
      type: 'send_docs_to_dify',
      icon: 'send',
      tooltip: 'send_brick_docs_to_dify',
    },
  ];

  onAction(action: HaAdminPanelBricksTableAction, brick: HaBrick): void {
    this.action.emit({
      brick: brick,
      type: action.type,
    });
  }
}
