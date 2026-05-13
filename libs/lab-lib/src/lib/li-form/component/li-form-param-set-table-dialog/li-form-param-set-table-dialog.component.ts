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
import { TdParamSpecs } from '@monorepo/technical-doc';

import { LiFormValueComponent } from '../li-form-value/li-form-value.component';

export interface LiFormParamSetTableDialogInput {
  title: string;
  data: unknown[];
  specs: TdParamSpecs;
}

/**
 * Dialog that displays param_set data as a columnar table with one column
 * per spec key and one row per data entry.
 */
@Component({
  selector: 'li-form-param-set-table-dialog',
  templateUrl: './li-form-param-set-table-dialog.component.html',
  styleUrl: './li-form-param-set-table-dialog.component.scss',
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
    LiFormValueComponent,
  ],
})
export class LiFormParamSetTableDialogComponent {
  data = inject<LiFormParamSetTableDialogInput>(MAT_DIALOG_DATA);

  get displayedColumns(): string[] {
    return Object.keys(this.data.specs);
  }

  getColumnHeader(col: string): string {
    return this.data.specs[col]?.human_name || col;
  }
}
