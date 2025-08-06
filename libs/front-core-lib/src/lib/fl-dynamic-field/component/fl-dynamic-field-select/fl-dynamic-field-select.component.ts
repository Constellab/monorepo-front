import { Component, computed, Input, input, Signal } from '@angular/core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';
import {
  FlDynamicFieldSelectKeyNameOption,
  FlDynamicFieldSelectOptions,
} from '../../model/fl-dynamic-field-config.class';

type FlGroupedSelectOption = Record<string, FlDynamicFieldSelectKeyNameOption[]>;

@Component({
  selector: 'fl-dynamic-field-select',
  templateUrl: './fl-dynamic-field-select.component.html',
  styleUrls: ['./fl-dynamic-field-select.component.scss'],
  standalone: false,
})
export class FlDynamicFieldSelectComponent extends FlDynamicFieldAbstractDirective {
  selectOptionsInput = input<FlDynamicFieldSelectOptions>();

  selectOptions: Signal<FlDynamicFieldSelectKeyNameOption[]> = computed(() => {
    if (!(this.selectOptionsInput()?.length > 0)) {
      return [];
    }

    if (typeof this.selectOptionsInput()[0] != 'string') {
      return this.selectOptionsInput() as FlDynamicFieldSelectKeyNameOption[];
    }

    return this.selectOptionsInput().map((str) => {
      return {
        key: str,
        humanName: str,
      } as FlDynamicFieldSelectKeyNameOption;
    });
  });

  selectOptionsGroups: Signal<FlGroupedSelectOption> = computed(() => {
    if (!this.selectOptionsInput()?.length) {
      return null;
    }

    const groups: FlGroupedSelectOption = {};
    this.selectOptionsInput().forEach((option) => {
      if (typeof option === 'object' && option.group && option.group.length > 0) {
        if (!groups[option.group]) {
          groups[option.group] = [];
        }
        groups[option.group].push(option);
      }
    });

    return groups;
  });

  @Input() prefix: string;

  @Input() suffix: string;
}
