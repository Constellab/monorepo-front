import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy,Component, computed, inject, input, output } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TdParamSpecEntry, TdParamSpecTypeEnum } from '../../model/td-config-spec.class';

@Component({
  selector: 'td-editable-param-specs-table',
  templateUrl: './td-editable-param-specs-table.component.html',
  styleUrl: './td-editable-param-specs-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdEditableParamSpecsTableComponent {
  private static readonly TYPES_WITHOUT_OPTIONAL = [TdParamSpecTypeEnum.COMPUTED_PARAM];
  private static readonly TYPES_WITHOUT_DEFAULT = [
    TdParamSpecTypeEnum.COMPUTED_PARAM,
    TdParamSpecTypeEnum.PARAM_SET,
  ];

  private translateService = inject(FlTranslateService);

  columns = input<string[]>(['label', 'type', 'optional', 'default_value', 'additional_info', 'menu']);
  outerFieldSpecs = input<TdParamSpecEntry[]>([]);

  reorderEnabled = input<boolean>(false);

  displayedColumns = computed(() => {
    const cols = this.columns();
    if (this.reorderEnabled() && !cols.includes('drag')) {
      return ['drag', ...cols];
    }
    return cols;
  });

  table = input.required<FlArrayObs<TdParamSpecEntry>>();

  editElementClick = output<TdParamSpecEntry>();
  deleteElementClick = output<TdParamSpecEntry>();
  reorderClick = output<string[]>();

  edit(entry: TdParamSpecEntry): void {
    this.editElementClick.emit(entry);
  }

  delete(entry: TdParamSpecEntry): void {
    this.deleteElementClick.emit(entry);
  }

  drop(event: CdkDragDrop<TdParamSpecEntry[]>): void {
    const data = this.table().array;
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.table().setData(data);
    this.reorderClick.emit(data.map((entry) => entry.key));
  }

  showOptional(entry: TdParamSpecEntry): boolean {
    return !TdEditableParamSpecsTableComponent.TYPES_WITHOUT_OPTIONAL.includes(entry.spec.type);
  }

  showDefaultValue(entry: TdParamSpecEntry): boolean {
    return !TdEditableParamSpecsTableComponent.TYPES_WITHOUT_DEFAULT.includes(entry.spec.type);
  }

  getLabel(entry: TdParamSpecEntry): string {
    return entry.spec.human_name || ClStringHelper.capitalize(entry.key);
  }

  getAdditionalInfoItems(entry: TdParamSpecEntry): { key: string; label: string; value: string }[] {
    const info = entry.spec.additional_info;
    if (!info || typeof info !== 'object') return [];

    switch (entry.spec.type) {
      case TdParamSpecTypeEnum.STR:
        return this.buildItems(info, [
          { key: 'min_length', label: this.t('td.min_length') },
          { key: 'max_length', label: this.t('td.max_length') },
        ]);

      case TdParamSpecTypeEnum.INT:
      case TdParamSpecTypeEnum.FLOAT:
        return this.buildItems(info, [
          { key: 'min_value', label: this.t('td.min_value') },
          { key: 'max_value', label: this.t('td.max_value') },
        ]);

      case TdParamSpecTypeEnum.COMPUTED_PARAM:
        return this.buildItems(info, [
          { key: 'expression', label: this.t('td.expression') },
          { key: 'result_type', label: this.t('td.result_type') },
        ]);

      case TdParamSpecTypeEnum.PARAM_SET:
        return this.buildItems(info, [
          {
            key: 'param_set',
            label: this.t('td.columns'),
            format: (v) => (typeof v === 'object' ? Object.keys(v).length + ' columns' : String(v)),
          },
          { key: 'min_number_of_occurrences', label: this.t('td.min_number_of_occurrences') },
          { key: 'max_number_of_occurrences', label: this.t('td.max_number_of_occurrences') },
          {
            key: 'default_rows',
            label: this.t('td.default_rows'),
            format: (v) => (Array.isArray(v) ? String(v.length) : String(v)),
          },
          {
            key: 'default_rows_mode',
            label: this.t('td.default_rows_mode'),
            format: (v) => this.t('td.default_rows_mode_' + (v ?? 'editable')),
          },
        ]);

      case TdParamSpecTypeEnum.CREDENTIALS_PARAM:
        return this.buildItems(info, [{ key: 'credentials_type', label: this.t('td.credentials_type') }]);

      case TdParamSpecTypeEnum.SELECT_PARAM:
        return this.buildItems(info, [
          {
            key: 'allowed_values',
            label: this.t('td.options'),
            format: (v) => (Array.isArray(v) ? v.map((o: any) => o.label ?? o.value).join(', ') : String(v)),
          },
          { key: 'multiple', label: this.t('td.allow_multiple') },
        ]);

      case TdParamSpecTypeEnum.DATE_PARAM:
        return this.buildItems(info, [
          { key: 'include_time', label: this.t('td.include_time') },
          { key: 'min_value', label: this.t('td.min_value') },
          { key: 'max_value', label: this.t('td.max_value') },
        ]);

      default:
        return Object.keys(info)
          .filter((key) => info[key] != null && typeof info[key] !== 'object')
          .map((key) => ({ key, label: key, value: String(info[key]) }));
    }
  }

  private t(key: string): string {
    return this.translateService.translate(key);
  }

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
