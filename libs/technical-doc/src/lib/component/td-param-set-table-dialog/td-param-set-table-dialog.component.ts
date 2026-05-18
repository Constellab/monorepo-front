import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
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
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';

import { TdParamSpecs } from '../../model/td-config-spec.class';
import { TdParamValueComponent } from '../td-param-value/td-param-value.component';

export interface TdParamSetTableDialogInput {
  title: string;
  data: unknown[];
  specs: TdParamSpecs;
}

/**
 * Dialog that displays param_set data as a columnar table with one column
 * per spec key and one row per data entry.
 */
@Component({
  selector: 'td-param-set-table-dialog',
  templateUrl: './td-param-set-table-dialog.component.html',
  styleUrl: './td-param-set-table-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
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
    TdParamValueComponent,
  ],
})
export class TdParamSetTableDialogComponent {
  data = inject<TdParamSetTableDialogInput>(MAT_DIALOG_DATA);

  get displayedColumns(): string[] {
    return Object.keys(this.data.specs);
  }

  getColumnHeader(col: string): string {
    return this.data.specs[col]?.human_name || col;
  }
}
