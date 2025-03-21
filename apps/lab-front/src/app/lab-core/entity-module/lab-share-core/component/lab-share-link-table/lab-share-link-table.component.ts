import { Component, Input } from '@angular/core';
import {
  LabSharedEntity,
  LabShareLink,
  LabShareLinkDatasource,
} from '../../../../model/entities/lab-share.entity';
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
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabShareLinkLinksComponent } from '../lab-share-link-links/lab-share-link-links.component';
import { LabShareLinkActionsMenuComponent } from '../lab-share-link-actions-menu/lab-share-link-actions-menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

@Component({
  selector: 'lab-share-link-table',
  templateUrl: './lab-share-link-table.component.html',
  styleUrls: ['./lab-share-link-table.component.scss'],
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
    LabShareLinkLinksComponent,
    LabShareLinkActionsMenuComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
    FlTextIconModule,
  ],
})
export class LabShareLinkTableComponent {
  @Input({ required: true }) datasource: LabShareLinkDatasource;

  @Input({ required: true }) columns: FlTableColumnStatic<LabSharedEntity>[];

  onLinkUpdated(entity: LabShareLink): void {
    this.datasource.updateItem(entity);
  }

  onLinkDeleted(entity: LabShareLink): void {
    this.datasource.removeItem(entity);
  }
}
