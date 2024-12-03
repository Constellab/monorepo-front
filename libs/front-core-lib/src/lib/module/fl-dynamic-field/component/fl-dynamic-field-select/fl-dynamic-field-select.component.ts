import { Component, computed, input, Input, Signal } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';
import {
  FlDynamicFieldSelectKeyNameOption,
  FlDynamicFieldSelectOptions,
} from '../../model/fl-dynamic-field-config.class';

@Component({
  selector: 'fl-dynamic-field-select',
  templateUrl: './fl-dynamic-field-select.component.html',
  styleUrls: ['./fl-dynamic-field-select.component.scss'],
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

  @Input() prefix: string;

  @Input() suffix: string;
}
