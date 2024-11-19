import { Component, Input, output } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClHelpService } from '@monorepo/core-lib';
import { TdParamSpecBase } from '../../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';

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
})
export class TdEditableParamSpecsTableComponent {
  @Input({ required: true }) editParamSpecState: TdAbstractDynamicParamSpecState;

  @Input() columns: FlTableColumnStatic<TdEditableParamSpec>[] = [
    'name',
    'type',
    'optional',
    'default_value',
    'human_name',
  ];

  @Input() columnsToDisplayWithExpand = ['expand', ...this.columns, 'edit', 'delete'];

  expandedElement: TdEditableParamSpec | null;

  onEditElementClick = output<TdEditableParamSpec>();

  onDeleteElementClick = output<TdEditableParamSpec>();

  constructor() {}

  edit(event: Event, element: TdEditableParamSpec): void {
    ClHelpService.stopEventPropagation(event);
    this.onEditElementClick.emit(element);
  }

  delete(event: Event, element: TdEditableParamSpec): void {
    ClHelpService.stopEventPropagation(event);
    this.onDeleteElementClick.emit(element);
  }

  protected readonly Object = Object;
  protected readonly emitDistinctChangesOnlyDefaultValue = emitDistinctChangesOnlyDefaultValue;
}
