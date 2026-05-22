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
import { TranslatePipe } from '@ngx-translate/core';

import { tdGetParamSpecDisplayName } from '../../logic/td-param-spec.logic';
import { TdParamSpec, TdParamSpecs } from '../../model/td-config-spec.class';
import { TdParamValueComponent } from '../td-param-value/td-param-value.component';

export interface TdParamTableRow {
  key: string;
  name: string;
  shortDescription: string;
  rawValue: unknown;
  spec: TdParamSpec;
}

@Component({
  selector: 'td-param-table',
  templateUrl: './td-param-table.component.html',
  styleUrl: './td-param-table.component.scss',
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
    TdParamValueComponent,
  ],
})
/**
 * Displays parameter specs and their values as a vertical name/value table.
 * Each row represents one field with its display name and formatted value.
 */
export class TdParamTableComponent {
  values = input.required<Record<string, unknown>>();
  specs = input.required<TdParamSpecs>();

  tableColumns = ['name', 'value'];

  tableData = computed<TdParamTableRow[]>(() => {
    const values = this.values();
    const specs = this.specs();
    if (!values) return [];

    return Object.entries(values).map(([key, raw]) => {
      const spec = specs?.[key];
      return {
        key,
        name: tdGetParamSpecDisplayName(key, specs),
        shortDescription: spec?.short_description ?? '',
        rawValue: raw,
        spec,
      };
    });
  });
}
