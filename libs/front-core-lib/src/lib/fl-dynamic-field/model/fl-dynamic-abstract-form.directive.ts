import { InputSignal, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FlDynamicFormAbstractControl } from './fl-dynamic-field-config.class';

/**
 * Generic type for the Dynamic control components
 */
export interface FlDynamicAbstractFormDirective {
  config: Signal<FlDynamicFormAbstractControl>;

  control: Signal<AbstractControl>;

  configName?: InputSignal<string>;
}
