import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabTypeEntity, LabTypeEntityDatasource } from '../../../../model/entities/lab-type/lab-type.entity';
import { ClHelpService } from '@monorepo/core-lib';
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
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { LabTypeShowDetailButtonComponent } from '../lab-type-show-detail-button/lab-type-show-detail-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-process-type-table',
  templateUrl: './lab-process-type-table.component.html',
  styleUrls: ['./lab-process-type-table.component.scss'],
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
    LabTypeShowDetailButtonComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LabProcessTypeTableComponent {
  @Input({ required: true }) datasource: LabTypeEntityDatasource;

  @Input({ required: true }) columns: FlTableColumnStatic<LabTypeEntity>[];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() typeSelected: EventEmitter<LabTypeEntity> = new EventEmitter<LabTypeEntity>();

  rowClicked(type: LabTypeEntity): void {
    if (this.rowSelectable) {
      this.typeSelected.next(type);
    }
  }

  stopEventPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }
}
