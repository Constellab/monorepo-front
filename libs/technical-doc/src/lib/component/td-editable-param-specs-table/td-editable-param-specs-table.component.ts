import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject, Input, OnInit, output } from '@angular/core';
import { ClHelpService, ClStringHelper } from '@monorepo/core-lib';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TdParamSpecEntry } from '../../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';

@Component({
  selector: 'td-editable-param-specs-table',
  templateUrl: './td-editable-param-specs-table.component.html',
  styleUrl: './td-editable-param-specs-table.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: false,
})
export class TdEditableParamSpecsTableComponent implements OnInit {
  private dynamicParamSpecState = inject(TdAbstractDynamicParamSpecState);
  private translateService = inject(FlTranslateService);

  @Input() columns: FlTableColumnStatic<TdParamSpecEntry>[] = [
    'key',
    'type',
    'optional',
    'default_value',
    'human_name',
  ];

  @Input() columnsToDisplayWithExpand = ['expand', ...this.columns, 'menu'];

  @Input() displayWithExpand: boolean = true;

  table: FlArrayObs<TdParamSpecEntry> = this.dynamicParamSpecState.paramSpecsTable;

  expandedElement: TdParamSpecEntry | null;

  editElementClick = output<TdParamSpecEntry>();

  deleteElementClick = output<TdParamSpecEntry>();

  ngOnInit(): void {
    if (!this.displayWithExpand) this.columnsToDisplayWithExpand = this.columns;
  }

  edit(event: Event, element: TdParamSpecEntry): void {
    ClHelpService.stopEventPropagation(event);
    this.editElementClick.emit(element);
  }

  delete(event: Event, element: TdParamSpecEntry): void {
    ClHelpService.stopEventPropagation(event);
    this.deleteElementClick.emit(element);
  }

  getColumnValue(entry: TdParamSpecEntry, column: string): string {
    if (column === 'key') return entry.key;

    const value = (entry.spec as any)[column];

    if (value == null && column !== 'optional') {
      if (column === 'human_name') {
        return entry.key ? ClStringHelper.capitalize(entry.key) : '';
      }
      return '';
    }

    if (column === 'default_value') {
      if (value?.name) return value.name;
      if (value?.title) return value.title;
      if (value?.id) return value.id;
      if (this.isObject(value)) return 'object';
      const str = String(value);
      return str.length > 20 ? str.substring(0, 20) + '...' : str;
    }

    if (column === 'type') return ClStringHelper.snakeCaseToSentence(value);

    if (this.isBoolean(value)) {
      return this.translateService.translate(value ? 'td.yes' : 'td.no');
    }

    return value;
  }

  private isBoolean(v: any): boolean {
    return typeof v === 'boolean';
  }

  private isObject(v: any): boolean {
    return typeof v === 'object' && !Array.isArray(v) && v !== null;
  }

  protected readonly Object = Object;
}
