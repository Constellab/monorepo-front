import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
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
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiSharedEntity,LiShareLink, LiShareLinkDatasource } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiShareLinkActionsMenuComponent } from '../li-share-link-actions-menu/li-share-link-actions-menu.component';
import { LiShareLinkLinksComponent } from '../li-share-link-links/li-share-link-links.component';

@Component({
  selector: 'li-share-link-table',
  templateUrl: './li-share-link-table.component.html',
  styleUrls: ['./li-share-link-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatTooltip,
    NgClass,
    FlUserModule,
    LiShareLinkLinksComponent,
    LiShareLinkActionsMenuComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
    FlTextIconModule,
  ],
})
export class LiShareLinkTableComponent {
  @Input({ required: true }) datasource: LiShareLinkDatasource;

  @Input({ required: true }) columns: FlTableColumnStatic<LiSharedEntity>[];

  onLinkUpdated(entity: LiShareLink): void {
    this.datasource.updateItem(entity);
  }

  onLinkDeleted(entity: LiShareLink): void {
    this.datasource.removeItem(entity);
  }
}
