import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { ClHelpService } from '@monorepo/core-lib';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { LiTypeEntity, LiTypeEntityDatasource } from '@monorepo/lab-lib/li-core';
import {
  TdTechnicalDocModule,
  TdTypeErrorsDialogComponent,
  TdTypeErrorsDialogData,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiTypeShowDetailButtonComponent } from '../li-type-show-detail-button/li-type-show-detail-button.component';

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
  private dialogService = inject(FlDialogService);

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

  openTypeErrors(event: MouseEvent, processType: LiTypeEntity): void {
    ClHelpService.stopEventPropagation(event);
    const data: TdTypeErrorsDialogData = {
      typingName: processType.typingName,
      errors: processType.errors,
    };
    this.dialogService.openSmallDialog(TdTypeErrorsDialogComponent, { data });
  }

  stopEventPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }
}
