import { ClHelpService } from '@monorepo/core-lib';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LiTypeEntity, LiTypeEntityDatasource } from '@monorepo/lab-lib/li-core';
import { LiTypeShowDetailButtonComponent } from '../li-type-show-detail-button/li-type-show-detail-button.component';
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
import { MatSortHeader } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-process-type-table',
  templateUrl: './li-process-type-table.component.html',
  styleUrls: ['./li-process-type-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    NgClass,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatIcon,
    MatTooltip,
    TdTechnicalDocModule,
    FlCoreComponentModule,
    LiTypeShowDetailButtonComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LiProcessTypeTableComponent {
  @Input({ required: true }) datasource: LiTypeEntityDatasource;

  @Input({ required: true }) columns: FlTableColumnStatic<LiTypeEntity>[];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() typeSelected: EventEmitter<LiTypeEntity> = new EventEmitter<LiTypeEntity>();

  rowClicked(type: LiTypeEntity): void {
    if (this.rowSelectable) {
      this.typeSelected.next(type);
    }
  }

  stopEventPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }
}
