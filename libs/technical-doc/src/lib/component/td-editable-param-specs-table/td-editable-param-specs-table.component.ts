import { Component, inject, Input, OnInit, output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClHelpService, ClStringHelper } from '@monorepo/core-lib';
import { TdParamSpecBase } from '../../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';

export interface TdEditableParamSpec extends TdParamSpecBase {
  name: string;
}

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

  @Input() columns: FlTableColumnStatic<TdEditableParamSpec>[] = [
    'name',
    'type',
    'optional',
    'default_value',
    'human_name',
  ];

  @Input() columnsToDisplayWithExpand = ['expand', ...this.columns, 'menu'];

  @Input() displayWithExpand: boolean = true;

  table: FlArrayObs<TdEditableParamSpec> = this.dynamicParamSpecState.paramSpecsTable;

  expandedElement: TdEditableParamSpec | null;

  editElementClick = output<TdEditableParamSpec>();

  deleteElementClick = output<TdEditableParamSpec>();

  ngOnInit(): void {
    if (!this.displayWithExpand) this.columnsToDisplayWithExpand = this.columns;
  }

  edit(event: Event, element: TdEditableParamSpec): void {
    ClHelpService.stopEventPropagation(event);
    this.editElementClick.emit(element);
  }

  delete(event: Event, element: TdEditableParamSpec): void {
    ClHelpService.stopEventPropagation(event);
    this.deleteElementClick.emit(element);
  }

  getColumnValue(element: any, column: string): string {
    if (!element[column]) {
      if (column === 'human_name') {
        return element['name'] ? ClStringHelper.capitalize(element['name']) : '';
      }
      return '';
    }

    if (column === 'default_value') {
      if (element[column].name) {
        return element[column].name;
      } else if (element[column].title) {
        return element[column].title;
      } else if (element[column].id) {
        return element[column].id;
      } else if (this.isObject(element[column])) {
        return 'object';
      } else {
        const value: string = String(element[column]);
        if (value.length > 20) {
          return value.substring(0, 20) + '...';
        }
        return value;
      }
    } else if (column === 'type') {
      return ClStringHelper.snakeCaseToSentence(element[column]);
    } else if (this.isBoolean(element[column])) {
      if (element[column] === true) {
        return this.translateService.translate('yes');
      } else {
        return this.translateService.translate('no');
      }
    }
    return element[column];
  }

  private isBoolean(v: any): boolean {
    return typeof v === 'boolean';
  }

  private isObject(v: any): boolean {
    return typeof v === 'object' && !Array.isArray(v) && v !== null;
  }

  protected readonly Object = Object;
}
