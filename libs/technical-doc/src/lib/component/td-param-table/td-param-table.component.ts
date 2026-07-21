import { ChangeDetectionStrategy,Component, computed, input } from '@angular/core';
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

export interface TdParamTableCell {
  key: string;
  name: string;
  shortDescription: string;
  rawValue: unknown;
  spec: TdParamSpec;
}

/** A table row holding two field/value pairs (left and right). */
export interface TdParamTableRow {
  left: TdParamTableCell;
  right: TdParamTableCell | null;
}

@Component({
  selector: 'td-param-table',
  templateUrl: './td-param-table.component.html',
  styleUrl: './td-param-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
 * Displays parameter specs and their values as a name/value table.
 * Fields are laid out two pairs per row (4 columns: name, value, name, value)
 * to use the full width and reduce vertical height on large forms.
 */
export class TdParamTableComponent {
  values = input.required<Record<string, unknown>>();
  specs = input.required<TdParamSpecs>();

  tableColumns = ['name1', 'value1', 'name2', 'value2'];

  private cells = computed<TdParamTableCell[]>(() => {
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

  /** Group fields into rows of two so each table row shows two name/value pairs. */
  tableData = computed<TdParamTableRow[]>(() => {
    const cells = this.cells();
    const rows: TdParamTableRow[] = [];
    for (let i = 0; i < cells.length; i += 2) {
      rows.push({ left: cells[i], right: cells[i + 1] ?? null });
    }
    return rows;
  });
}
