import { Component, computed, inject, input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlDynamicAbstractFormDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlDynamicEditableFormGroupConfig } from '@monorepo/front-core-lib/fl-dynamic-field';

import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';

@Component({
  selector: 'td-dynamic-editable-form-group',
  templateUrl: './td-dynamic-editable-form-group.component.html',
  styleUrl: './td-dynamic-editable-form-group.component.scss',
  standalone: false,
})
export class TdDynamicEditableFormGroupComponent implements FlDynamicAbstractFormDirective {
  /**
   * Form where control will be added
   */
  control = input<UntypedFormGroup>();

  config = input<FlDynamicEditableFormGroupConfig>();

  empty_text = input<string>('td.no_value_in_array');

  hasConfig = computed(() => Object.keys(this.config().subConfigs).length > 0);

  private dynamicParamSpecState = inject(TdAbstractDynamicParamSpecState);

  openEditConfigDialog(): void {
    this.dynamicParamSpecState.openConfigureParamSpecsTableDialog();
  }
}
