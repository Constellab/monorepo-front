import { Component, Input, input, output } from '@angular/core';
import { ClHelpService, ClStringHelper } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';

import { TdParamSpecEntry, TdParamSpecTypeEnum } from '../../model/td-config-spec.class';

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
    if (entry.spec.type === TdParamSpecTypeEnum.PARAM_SET) return '';
    const value = entry.spec.default_value;
    if (value == null) return '';
    if (value?.name) return value.name;
    if (value?.title) return value.title;
    if (value?.id) return value.id;
    if (typeof value === 'object' && !Array.isArray(value)) return 'object';
    const str = String(value);
    return str.length > 20 ? str.substring(0, 20) + '...' : str;
  }

  getAdditionalInfoItems(entry: TdParamSpecEntry): { key: string; label: string; value: any }[] {
    const info = entry.spec.additional_info;
    if (!info || typeof info !== 'object') return [];

    return Object.keys(info)
      .filter((key) => info[key] != null && typeof info[key] !== 'object')
      .map((key) => ({
        key,
        label: key,
        value: info[key],
      }));
  }
}
