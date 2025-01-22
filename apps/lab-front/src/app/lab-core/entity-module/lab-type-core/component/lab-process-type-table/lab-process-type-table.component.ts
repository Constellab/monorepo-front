import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabTypeEntity, LabTypeEntityDatasource } from '../../../../model/entities/lab-type/lab-type.entity';
import { ClHelpService } from '@monorepo/core-lib';
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
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { FlCoreComponentModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-component/fl-core-component.module';
import { LabTypeShowDetailButtonComponent } from '../lab-type-show-detail-button/lab-type-show-detail-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-process-type-table',
  templateUrl: './lab-process-type-table.component.html',
  styleUrls: ['./lab-process-type-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
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
