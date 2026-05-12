import { Component, Input, input, output } from '@angular/core';
import { ClHelpService, ClStringHelper } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';

import { TD_TYPES_WITHOUT_DEFAULT_VALUE, TdParamSpecEntry } from '../../model/td-config-spec.class';

@Component({
  selector: 'td-editable-param-specs-table',
  templateUrl: './td-editable-param-specs-table.component.html',
  styleUrl: './td-editable-param-specs-table.component.scss',
  standalone: false,
})
export class TdEditableParamSpecsTableComponent {
  @Input() columns: string[] = ['label', 'type', 'optional', 'default_value', 'additional_info', 'menu'];

  table = input.required<FlArrayObs<TdParamSpecEntry>>();

  editElementClick = output<TdParamSpecEntry>();
  deleteElementClick = output<TdParamSpecEntry>();

  edit(event: Event, entry: TdParamSpecEntry): void {
    ClHelpService.stopEventPropagation(event);
    this.editElementClick.emit(entry);
  }

  delete(event: Event, entry: TdParamSpecEntry): void {
    ClHelpService.stopEventPropagation(event);
    this.deleteElementClick.emit(entry);
  }

  getLabel(entry: TdParamSpecEntry): string {
    return entry.spec.human_name || ClStringHelper.capitalize(entry.key);
  }

  formatDefaultValue(entry: TdParamSpecEntry): string {
    if (TD_TYPES_WITHOUT_DEFAULT_VALUE.includes(entry.spec.type)) return '';
    const value = entry.spec.default_value;
    if (value == null) return '';
    if (value?.name) return value.name;
    if (value?.title) return value.title;
    if (value?.id) return value.id;
    if (typeof value === 'object' && !Array.isArray(value)) return 'object';
    const str = String(value);
    return str.length > 20 ? str.substring(0, 20) + '...' : str;
  }

  getAdditionalInfoItems(entry: TdParamSpecEntry): { key: string; label: string; value: string }[] {
    const info = entry.spec.additional_info;
    if (!info || typeof info !== 'object') return [];

    switch (entry.spec.type) {
      case 'str':
        return this.buildItems(info, [
          { key: 'min_length', label: 'Min length' },
          { key: 'max_length', label: 'Max length' },
          { key: 'allowed_values', label: 'Allowed', format: this.formatArray },
        ]);

      case 'int':
      case 'float':
        return this.buildItems(info, [
          { key: 'min_value', label: 'Min' },
          { key: 'max_value', label: 'Max' },
          { key: 'allowed_values', label: 'Allowed', format: this.formatArray },
        ]);

      case 'computed_param':
        return this.buildItems(info, [
          { key: 'expression', label: 'Expression' },
          { key: 'result_type', label: 'Result type' },
        ]);

      case 'param_set':
        return this.buildItems(info, [
          { key: 'max_number_of_occurrences', label: 'Max rows' },
          {
            key: 'param_set',
            label: 'Columns',
            format: (v) => (typeof v === 'object' ? Object.keys(v).length + ' columns' : String(v)),
          },
        ]);

      case 'credentials_param':
        return this.buildItems(info, [{ key: 'credentials_type', label: 'Credentials type' }]);

      default:
        return Object.keys(info)
          .filter((key) => info[key] != null && typeof info[key] !== 'object')
          .map((key) => ({ key, label: key, value: String(info[key]) }));
    }
  }

  private formatArray = (v: any): string => (Array.isArray(v) ? v.join(', ') : String(v));

  private buildItems(
    info: Record<string, any>,
    fields: { key: string; label: string; format?: (v: any) => string }[]
  ): { key: string; label: string; value: string }[] {
    return fields
      .filter((f) => info[f.key] != null)
      .map((f) => ({
        key: f.key,
        label: f.label,
        value: f.format ? f.format(info[f.key]) : String(info[f.key]),
      }));
  }
}
