import { Component, computed, input } from '@angular/core';
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
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { liGetFieldDisplayName } from '../li-form-history/li-form-history.logic';
import { LiFormValueComponent } from '../li-form-value/li-form-value.component';

export interface LiFormContentTableRow {
  key: string;
  name: string;
  shortDescription: string;
  rawValue: unknown;
  spec: TdParamSpec;
}

@Component({
  selector: 'li-form-content-table',
  templateUrl: './li-form-content-table.component.html',
  styleUrl: './li-form-content-table.component.scss',
  imports: [
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
    TranslatePipe,
    LiFormValueComponent,
  ],
})
/**
 * Displays a form's top-level fields as a vertical name/value table.
 * Each row represents one field with its display name and formatted value.
 */
export class LiFormContentTableComponent {
  values = input.required<Record<string, unknown>>();
  specs = input.required<TdParamSpecs>();

  tableColumns = ['name', 'value'];

  tableData = computed<LiFormContentTableRow[]>(() => {
    const values = this.values();
    const specs = this.specs();
    if (!values) return [];

    return Object.entries(values).map(([key, raw]) => {
      const spec = specs?.[key];
      return {
        key,
        name: liGetFieldDisplayName(key, specs),
        shortDescription: spec?.short_description ?? '',
        rawValue: raw,
        spec,
      };
    });
  });
}
